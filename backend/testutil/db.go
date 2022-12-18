package testutil

import (
	"database/sql"
	"fmt"
	"os"
	"testing"

	"github.com/jmoiron/sqlx"
)

func OpenDBForTest(t *testing.T) *sqlx.DB {
	port := 33306
	if _, defined := os.LookupEnv("CI"); defined {
		port = 3306
	}
	db, err := sql.Open(
		"mysql",
		fmt.Sprintf("temp_project:temp_project@tcp(127.0.0.1:%d)/temp_project?parseTime=true", port),
	)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(
		func() { _ = db.Close() },
	)
	return sqlx.NewDb(db, "mysql")

}
