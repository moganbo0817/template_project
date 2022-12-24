package handler

import (
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

type DeleteTask struct {
	Service DeleteTaskService
}

func (dt *DeleteTask) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		RespondJSON(ctx, w, &ErrResponse{
			Message: err.Error(),
		}, http.StatusInternalServerError)
		return
	}

	// Service呼び出し
	num, err := dt.Service.DeleteTask(ctx, id)

	if err != nil {
		RespondJSON(ctx, w, &ErrResponse{
			Message: err.Error(),
		}, http.StatusInternalServerError)
		return
	}

	// response成形
	rsp := struct {
		ID int `json:"count"`
	}{ID: int(num)}

	RespondJSON(ctx, w, rsp, http.StatusOK)
}
