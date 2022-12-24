package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	"github.com/moganbo0817/template_project/entity"
)

type UpdateTask struct {
	Service   UpdateTaskService
	Validator *validator.Validate
}

func (ut *UpdateTask) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var b struct {
		Id     int64             `json:"id" validate:"required"`
		Title  string            `json:"title"`
		Status entity.TaskStatus `json:"status"`
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

	if id, _ := strconv.ParseInt(chi.URLParam(r, "userId"), 10, 64); id != b.Id {
		RespondJSON(ctx, w, &ErrResponse{
			Message: "更新対象のユーザが不正です。",
		}, http.StatusBadRequest)
		return
	}

	// Service呼び出し
	t, err := ut.Service.UpdateTask(ctx, b.Id, b.Title, string(b.Status))

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
