package main

import (
	"encoding/json"
	"net/http"
)

func containers(w http.ResponseWriter, r *http.Request) {
	containers, err := manager.ListContainers(true)
	if err != nil {
		logger.WithField("error", err).Error("list containers")
		http.Error(w, err.Error(), http.StatusInternalServerError)

		return
	}

	w.Header().Set("content-type", "application/json")
	if err := json.NewEncoder(w).Encode(containers); err != nil {
		logger.WithField("error", err).Error("encode json")

		return
	}
}
