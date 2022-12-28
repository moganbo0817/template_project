package handler

import (
	"bytes"
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/go-playground/validator/v10"
	"github.com/moganbo0817/template_project/testutil"
)

func TestLogin_ServeHTTP(t *testing.T) {
	type moq struct {
		token string
		role  string
		err   error
	}

	type want struct {
		status  int
		rspFile string
	}

	tests := map[string]struct {
		reqFile string
		moq     moq
		want    want
	}{
		// Testしたいだけ並べる
		"ok": {
			reqFile: "testdata/login/ok_req.json.golden",
			moq: moq{
				token: "from_moq",
				role:  "admin",
			},
			want: want{
				status:  http.StatusOK,
				rspFile: "testdata/login/ok_rsp.json.golden",
			},
		},
		"badRequest": {
			reqFile: "testdata/login/bad_req.json.golden",
			want: want{
				status:  http.StatusBadRequest,
				rspFile: "testdata/login/bad_rsp.json.golden",
			},
		},
		"internal_server_error": {
			reqFile: "testdata/login/ok_req.json.golden",
			moq: moq{
				err: errors.New("error from mock"),
			},
			want: want{
				status:  http.StatusInternalServerError,
				rspFile: "testdata/login/internal_server_error_rsp.json.golden",
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
				"/login",
				bytes.NewReader(testutil.LoadFile(t, tt.reqFile)),
			)

			// テスト毎に固有で設定
			moq := &LoginServiceMock{}
			moq.LoginFunc = func(
				ctx context.Context, name, pw string,
			) (string, string, error) {
				return tt.moq.token, tt.moq.role, tt.moq.err
			}
			sut := Login{
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
