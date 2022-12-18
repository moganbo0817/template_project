package handler

import (
	"encoding/json"
	"net/http"

	"github.com/go-playground/validator/v10"
)

type RegisterUser struct {
	Service   RegisterUserService
	Validator *validator.Validate
}

func (ru *RegisterUser) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var b struct {
		Name     string `json:"name" validate:"required"`
		Password string `json:"password" validate:"required"`
		Role     string `json:"role" validate:"required"`
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
	if err := ru.Validator.Struct(b); err != nil {
		RespondJSON(ctx, w, &ErrResponse{
			Message: err.Error(),
		}, http.StatusBadRequest)
		return
	}

	// Service呼び出し
	u, err := ru.Service.RegisterUser(ctx, b.Name, b.Password, b.Role)

	if err != nil {
		RespondJSON(ctx, w, &ErrResponse{
			Message: err.Error(),
		}, http.StatusInternalServerError)
		return
	}

	// response成形
	rsp := struct {
		ID int `json:"id"`
	}{ID: int(u.ID)}

	RespondJSON(ctx, w, rsp, http.StatusOK)
}
