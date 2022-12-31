package service

import (
	"context"

	"github.com/moganbo0817/template_project/entity"
	"github.com/moganbo0817/template_project/store"
)

//go:generate go run github.com/matryer/moq -out moq_test.go . TaskAdder TaskUpdate TaskListers TaskLister UserRegister UserGetter TokenGenerator
type TaskAdder interface {
	AddTask(ctx context.Context, db store.Beginner, t *entity.Task) error
}

type TaskListers interface {
	ListTasks(ctx context.Context, db store.Queryer) (entity.Tasks, error)
}

type TaskLister interface {
	ListTask(ctx context.Context, db store.Queryer, id int64) (*entity.Task, error)
}

type TaskUpdate interface {
	UpdateTask(ctx context.Context, db store.Execer, t *entity.Task) (int64, error)
}

type TaskDelete interface {
	DeleteTask(ctx context.Context, db store.Execer, id int64) (int64, error)
}

type UserRegister interface {
	RegisterUser(ctx context.Context, db store.Execer, u *entity.User) error
}

type UserGetter interface {
	GetUser(ctx context.Context, db store.Queryer, name string) (*entity.User, error)
}

type TokenGenerator interface {
	GenerateToken(ctx context.Context, u entity.User) ([]byte, error)
}
