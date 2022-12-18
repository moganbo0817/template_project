package handler

import (
	"bytes"
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/go-playground/validator/v10"
	"github.com/moganbo0817/template_project/entity"
	"github.com/moganbo0817/template_project/testutil"
)

func TestRegisterUser(t *testing.T) {
	type want struct {
		status  int
		rspFile string
	}

	tests := map[string]struct {
		reqFile string
		want    want
	}{
		// Testしたいだけ並べる
		"ok": {
			reqFile: "testdata/register_user/ok_req.json.golden",
			want: want{
				status:  http.StatusOK,
				rspFile: "testdata/register_user/ok_rsp.json.golden",
			},
		},
		"badRequest": {
			reqFile: "testdata/register_user/bad_req.json.golden",
			want: want{
				status:  http.StatusBadRequest,
				rspFile: "testdata/register_user/bad_rsp.json.golden",
			},
		},
	}

	for n, tt := range tests {
		tt := tt
		t.Run(n, func(t *testing.T) {
			t.Parallel()

			w := httptest.NewRecorder()
			// pathとかmethodとかを指定
			r := httptest.NewRequest(
				http.MethodPost,
				"/user",
				bytes.NewReader(testutil.LoadFile(t, tt.reqFile)),
			)

			// テスト毎に固有で設定
			moq := &RegisterUserServiceMock{}
			moq.RegisterUserFunc = func(
				ctx context.Context, name, password, role string,
			) (*entity.User, error) {
				if tt.want.status == http.StatusOK {
					return &entity.User{ID: 1}, nil
				}
				return nil, errors.New("error from mock")
			}
			sut := RegisterUser{
				Service:   moq,
				Validator: validator.New(),
			}

			sut.ServeHTTP(w, r)

			resp := w.Result()
			testutil.AssertResponse(t,
				resp, tt.want.status, testutil.LoadFile(t, tt.want.rspFile),
			)
		})
	}

}
