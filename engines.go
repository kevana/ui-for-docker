package main

import (
	"encoding/json"
	"net/http"

	"github.com/citadel/citadel"
)

func engines(w http.ResponseWriter, r *http.Request) {
	engines := manager.Engines()

	w.Header().Set("content-type", "application/json")
	if err := json.NewEncoder(w).Encode(engines); err != nil {
		logger.WithField("error", err).Error("encode json")
	}
}

func enginesAdd(w http.ResponseWriter, r *http.Request) {
	var e *citadel.Engine
	if err := json.NewDecoder(r.Body).Decode(&e); err != nil {
		logger.WithField("error", err).Error("decode json")
		http.Error(w, err.Error(), http.StatusBadRequest)

		return
	}

	if err := e.Connect(nil); err != nil {
		logger.WithField("error", err).Error("connect engine")
		http.Error(w, err.Error(), http.StatusBadRequest)

		return
	}

	if err := manager.AddEngine(e); err != nil {
		logger.WithField("error", err).Error("add engine")
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
}

func enginesRemove(w http.ResponseWriter, r *http.Request) {
	var e *citadel.Engine
	if err := json.NewDecoder(r.Body).Decode(&e); err != nil {
		logger.WithField("error", err).Error("decode json")
		http.Error(w, err.Error(), http.StatusBadRequest)

		return
	}

	if err := manager.RemoveEngine(e); err != nil {
		logger.WithField("error", err).Error("remove engine")
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
}
