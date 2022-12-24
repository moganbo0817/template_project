package service

import (
	"context"
	"fmt"

	"github.com/moganbo0817/template_project/store"
)

type DeleteTask struct {
	DB   store.Execer
	Repo TaskDelete
}

func (d *DeleteTask) DeleteTask(ctx context.Context, id int64) (int64, error) {
	num, err := d.Repo.DeleteTask(ctx, d.DB, id)
	if err != nil {
		return 0, fmt.Errorf("failed to delete: %w", err)
	}

	return num, nil
}
