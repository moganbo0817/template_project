package main

import (
	"context"
	"net/http"

	"github.com/go-chi/chi/v5"

	"github.com/go-playground/validator/v10"
	"github.com/moganbo0817/template_project/auth"
	"github.com/moganbo0817/template_project/clock"
	"github.com/moganbo0817/template_project/config"
	"github.com/moganbo0817/template_project/handler"
	"github.com/moganbo0817/template_project/service"
	"github.com/moganbo0817/template_project/store"
)

func NewMux(ctx context.Context, cfg *config.Config) (http.Handler, func(), error) {
	mux := chi.NewRouter()
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		_, _ = w.Write([]byte(`{"status":"OK"}`))
	})
	v := validator.New()
	db, cleanup, err := store.New(ctx, cfg)
	if err != nil {
		return nil, cleanup, err
	}
	clocker := clock.RealClocker{}
	r := store.Repository{Clocker: clock.RealClocker{}}
	rcli, err := store.NewKVS(ctx, cfg)
	if err != nil {
		return nil, cleanup, err
	}
	jwter, err := auth.NewJWTer(rcli, clocker)
	if err != nil {
		return nil, cleanup, err
	}
	l := &handler.Login{
		Service: &service.Login{
			DB:             db,
			Repo:           &r,
			TokenGenerator: jwter,
		},
		Validator: v,
	}
	mux.Post("/login", l.ServeHTTP)

	at := &handler.AddTask{
		Service:   &service.AddTask{DB: db, Repo: &r},
		Validator: v,
	}

	lts := &handler.ListTasks{
		Service: &service.ListTasks{DB: db, Repo: &r},
	}

	lt := &handler.ListTask{
		Service: &service.ListTask{DB: db, Repo: &r},
	}

	mux.Route("/tasks", func(r chi.Router) {
		r.Use(handler.AuthMiddleware(jwter))
		r.Post("/", at.ServeHTTP)
		r.Get("/", lts.ServeHTTP)
		r.Get("/{id}", lt.ServeHTTP)
	})

	ru := &handler.RegisterUser{
		Service:   &service.RegisterUser{DB: db, Repo: &r},
		Validator: v,
	}

	mux.Route("/register", func(r chi.Router) {
		r.Use(handler.AuthMiddleware(jwter), handler.AdminMiddleWare)
		r.Post("/", ru.ServeHTTP)
	})

	return mux, cleanup, nil
}
