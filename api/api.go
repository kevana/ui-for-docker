package main // import "github.com/kevana/ui-for-docker"

import (
	"flag"
	"log"
	"net/http"
)

func main() {
	var (
		endpoint  = flag.String("H", "unix:///var/run/docker.sock", "Dockerd endpoint")
		addr      = flag.String("p", ":9000", "Address and port to serve UI For Docker")
		assets    = flag.String("a", ".", "Path to the assets")
		data      = flag.String("d", ".", "Path to the data")
		tlsverify = flag.Bool("tlsverify", false, "TLS support")
		tlscacert = flag.String("tlscacert", "/certs/ca.pem", "Path to the CA")
		tlscert   = flag.String("tlscert", "/certs/cert.pem", "Path to the TLS certificate file")
		tlskey    = flag.String("tlskey", "/certs/key.pem", "Path to the TLS key")
	)
	flag.Parse()

	tlsFlags := newTLSFlags(*tlsverify, *tlscacert, *tlscert, *tlskey)

	handler := newHandler(*assets, *data, *endpoint, tlsFlags)
	if err := http.ListenAndServe(*addr, handler); err != nil {
		log.Fatal(err)
	}
}
