package service

import (
	"context"
	"fmt"

	"github.com/moganbo0817/template_project/entity"
	"github.com/moganbo0817/template_project/store"
)

type UpdateTask struct {
	DB   store.Execer
	Repo TaskUpdate
}

func (u *UpdateTask) UpdateTask(ctx context.Context, id int64, title, status string) (int64, error) {
	t := &entity.Task{
		ID:     entity.TaskID(id),
		Title:  title,
		Status: entity.TaskStatus(status),
	}
	num, err := u.Repo.UpdateTask(ctx, u.DB, t)
	if err != nil {
		return 0, fmt.Errorf("failed to register: %w", err)
	}
	return num, nil
}
