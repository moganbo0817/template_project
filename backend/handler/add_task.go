package handler

import (
	"encoding/json"
	"net/http"

	"github.com/go-playground/validator/v10"
)

type AddTask struct {
	Service   AddTaskService
	Validator *validator.Validate
}

func (at *AddTask) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var b struct {
		Title string `json:"title" validate:"required"`
	}

	// jsonのDecodeを行う、bをポインタで渡しているのでbが更新される
	// jsonにDecodeできなかった場合ここでerr
	if err := json.NewDecoder(r.Body).Decode(&b); err != nil {
		RespondJSON(ctx, w, &ErrResponse{
			Message: err.Error(),
		}, http.StatusInternalServerError)
		return
	}

	// validation　structでstringとrequiredを指定
	err := validator.New().Struct(b)
	if err != nil {
		RespondJSON(ctx, w, &ErrResponse{
			Message: err.Error(),
		}, http.StatusBadRequest)
		return
	}

	// Service呼び出し
	t, err := at.Service.AddTask(ctx, b.Title)

	if err != nil {
		RespondJSON(ctx, w, &ErrResponse{
			Message: err.Error(),
		}, http.StatusInternalServerError)
		return
	}

	// response成形
	rsp := struct {
		ID int `json:"id"`
	}{ID: int(t.ID)}

	RespondJSON(ctx, w, rsp, http.StatusOK)
}
