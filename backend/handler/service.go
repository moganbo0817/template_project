package handler

import (
	"context"

	"github.com/moganbo0817/template_project/entity"
)

//go:generate go run github.com/matryer/moq -out moq_test.go . ListTasksService ListTaskService AddTaskService RegisterUserService LoginService
type ListTasksService interface {
	ListTasks(ctx context.Context) (entity.Tasks, error)
}

type ListTaskService interface {
	ListTask(ctx context.Context, id int64) (*entity.Task, error)
}

type AddTaskService interface {
	AddTask(ctx context.Context, title string) (*entity.Task, error)
}

type RegisterUserService interface {
	RegisterUser(ctx context.Context, name, password, role string) (*entity.User, error)
}

type LoginService interface {
	Login(ctx context.Context, name, pw string) (string, error)
}
