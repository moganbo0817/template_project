package handler

import (
	"net/http"
)

type ListTask struct {
	Service ListTaskService
}

func (lt *ListTask) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	// TODO requestからパスの取り出し、０件ハンドリング
	task, err := lt.Service.ListTask(ctx, 14)
	if err != nil {
		RespondJSON(ctx, w, &ErrResponse{
			Message: err.Error(),
		}, http.StatusInternalServerError)
		return
	}
	//rsp := task{}
	rsp := struct {
		ID     int    `json:"id"`
		Title  string `json:"title"`
		Status string `json:"status"`
	}{ID: int(task.ID), Title: task.Title, Status: string(task.Status)}
	// for _, t := range tasks {
	// 	rsp = append(rsp, task{
	// 		ID:     t.ID,
	// 		Title:  t.Title,
	// 		Status: t.Status,
	// 	})
	// }
	RespondJSON(ctx, w, rsp, http.StatusOK)
}
