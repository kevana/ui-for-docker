package main // import "github.com/kevana/ui-for-docker"

import (
	"flag"
	"io"
	"log"
	"net"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"github.com/gorilla/csrf"
	"io/ioutil"
	"fmt"
	"github.com/gorilla/securecookie"
	"crypto/tls"
	"crypto/x509"
)

var (
	endpoint 	= flag.String("H", "unix:///var/run/docker.sock", "Dockerd endpoint")
	addr     	= flag.String("p", ":9000", "Address and port to serve UI For Docker")
	assets   	= flag.String("a", ".", "Path to the assets")
	data     	= flag.String("d", ".", "Path to the data")
	tlsverify = flag.Bool("tlsverify", false, "TLS support")
	tlscacert = flag.String("tlscacert", "/certs/ca.pem", "Path to the CA")
	tlscert   = flag.String("tlscert", "/certs/cert.pem", "Path to the TLS certificate file")
	tlskey    = flag.String("tlskey", "/certs/key.pem", "Path to the TLS key")
	authKey  []byte
	authKeyFile = "authKey.dat"
)

type UnixHandler struct {
	path string
}

type TLSFlags struct {
	tls bool
	caPath string
	certPath string
	keyPath string
}

func (h *UnixHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	conn, err := net.Dial("unix", h.path)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Println(err)
		return
	}
	c := httputil.NewClientConn(conn, nil)
	defer c.Close()

	res, err := c.Do(r)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Println(err)
		return
	}
	defer res.Body.Close()

	copyHeader(w.Header(), res.Header)
	if _, err := io.Copy(w, res.Body); err != nil {
		log.Println(err)
	}
}

func copyHeader(dst, src http.Header) {
	for k, vv := range src {
		for _, v := range vv {
			dst.Add(k, v)
		}
	}
}

func createTLSConfig(flags TLSFlags) *tls.Config {
	cert, err := tls.LoadX509KeyPair(flags.certPath, flags.keyPath)
	if err != nil {
		log.Fatal(err)
	}
	caCert, err := ioutil.ReadFile(flags.caPath)
	if err != nil {
		log.Fatal(err)
	}
	caCertPool := x509.NewCertPool()
	caCertPool.AppendCertsFromPEM(caCert)
	tlsConfig := &tls.Config{
		Certificates: []tls.Certificate{cert},
		RootCAs:      caCertPool,
	}
	return tlsConfig;
}

func createTcpHandler(u *url.URL) http.Handler {
	u.Scheme = "http";
	return httputil.NewSingleHostReverseProxy(u)
}

func createTcpHandlerWithTLS(u *url.URL, flags TLSFlags) http.Handler {
	u.Scheme = "https";
	var tlsConfig = createTLSConfig(flags)
	proxy := httputil.NewSingleHostReverseProxy(u)
	proxy.Transport = &http.Transport{
		TLSClientConfig: tlsConfig,
	}
	return proxy;
}

func createUnixHandler(e string) http.Handler {
	return &UnixHandler{e}
}

func createHandler(dir string, d string, e string, flags TLSFlags) http.Handler {
	var (
		mux         = http.NewServeMux()
		fileHandler = http.FileServer(http.Dir(dir))
		h           http.Handler
	)

	u, perr := url.Parse(e)
	if perr != nil {
		log.Fatal(perr)
	}

	if u.Scheme == "tcp" {
		if flags.tls {
			h = createTcpHandlerWithTLS(u, flags)
		} else {
			h = createTcpHandler(u)
		}
	} else if u.Scheme == "unix" {
		var socketPath = u.Path
		if _, err := os.Stat(socketPath); err != nil {
			if os.IsNotExist(err) {
				log.Fatalf("unix socket %s does not exist", socketPath)
			}
			log.Fatal(err)
		}
		h = createUnixHandler(socketPath)
	} else {
		log.Fatalf("Bad Docker enpoint: %s. Only unix:// and tcp:// are supported.", e)
	}

	// Use existing csrf authKey if present or generate a new one.
	var authKeyPath = d + "/" + authKeyFile
	dat, err := ioutil.ReadFile(authKeyPath)
	if err != nil {
		fmt.Println(err)
		authKey = securecookie.GenerateRandomKey(32)
		err := ioutil.WriteFile(authKeyPath, authKey, 0644)
		if err != nil {
			fmt.Println("unable to persist auth key", err)
		}
	} else {
		authKey = dat
	}

	CSRF := csrf.Protect(
		authKey,
		csrf.HttpOnly(false),
		csrf.Secure(false),
	)

	mux.Handle("/dockerapi/", http.StripPrefix("/dockerapi", h))
	mux.Handle("/", fileHandler)
	return CSRF(csrfWrapper(mux))
}

func csrfWrapper(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-CSRF-Token", csrf.Token(r))
		h.ServeHTTP(w, r)
	})
}

func main() {
	flag.Parse()

	tlsFlags := TLSFlags{
		tls: *tlsverify,
		caPath: *tlscacert,
		certPath: *tlscert,
		keyPath: *tlskey,
	}

	handler := createHandler(*assets, *data, *endpoint, tlsFlags)
	if err := http.ListenAndServe(*addr, handler); err != nil {
		log.Fatal(err)
	}
}
