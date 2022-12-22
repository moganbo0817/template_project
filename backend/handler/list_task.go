package handler

import (
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

type ListTask struct {
	Service ListTaskService
}

func (lt *ListTask) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	id, err := strconv.ParseInt(chi.URLParam(r, "userId"), 10, 64)
	if err != nil {
		RespondJSON(ctx, w, &ErrResponse{
			Message: err.Error(),
		}, http.StatusInternalServerError)
		return
	}
	task, err := lt.Service.ListTask(ctx, id)
	if err != nil {
		RespondJSON(ctx, w, &ErrResponse{
			Message: err.Error(),
		}, http.StatusInternalServerError)
		return
	}
	rsp := struct {
		ID     int    `json:"id"`
		Title  string `json:"title"`
		Status string `json:"status"`
	}{ID: int(task.ID), Title: task.Title, Status: string(task.Status)}
	RespondJSON(ctx, w, rsp, http.StatusOK)
}
