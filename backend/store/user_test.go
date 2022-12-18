package store

import (
	"context"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/jmoiron/sqlx"
	"github.com/moganbo0817/template_project/clock"
	"github.com/moganbo0817/template_project/entity"
)

func TestRepository_RegisterUser(t *testing.T) {
	t.Parallel()
	ctx := context.Background()
	c := clock.FixedClocker{}
	var wantID int64 = 20
	okUser := &entity.User{
		Name:     "moga",
		Password: "moga",
		Role:     "user",
		Created:  c.Now(),
		Modified: c.Now(),
	}

	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = db.Close() })
	mock.ExpectExec(
		// エスケープが必要
		`INSERT INTO user \(name, password, role, created, modified\) VALUES \(\?, \?, \?, \?, \?\)`,
	).WithArgs(okUser.Name, okUser.Password, okUser.Role, c.Now(), c.Now()).
		WillReturnResult(sqlmock.NewResult(wantID, 1))

	xdb := sqlx.NewDb(db, "mysql")
	r := &Repository{Clocker: c}
	if err := r.RegisterUser(ctx, xdb, okUser); err != nil {
		t.Errorf("want no error, but got %v", err)
	}
}

// データ登録してDB見るのはこっち 必要に応じて作成
// func TestGetUser(t *testing.T) {
// 	ctx := context.Background()
// 	tx, err := testutil.OpenDBForTest(t).BeginTxx(ctx, nil)
// 	t.Cleanup(func() { _ = tx.Rollback() })
// 	if err != nil {
// 		t.Fatal(err)
// 	}
// 	wants := prepareTasks(ctx, t, tx)

// 	sut := &Repository{}
// 	gots, err := sut.GetUser(ctx, tx, "moga")
// 	if err != nil {
// 		t.Fatalf("unexpected error: %v", err)
// 	}
// 	if d := cmp.Diff(gots, wants); len(d) != 0 {
// 		t.Errorf("differs:(-got +want\n%s", d)
// 	}
// }
