package main

// TLSFlags defines all the flags associated to the SSL configuration
type TLSFlags struct {
	tls      bool
	caPath   string
	certPath string
	keyPath  string
}

// newTLSFlags creates a new TLSFlags from command flags
func newTLSFlags(tls bool, cacert string, cert string, key string) TLSFlags {
	return TLSFlags{
		tls:      tls,
		caPath:   cacert,
		certPath: cert,
		keyPath:  key,
	}
}
