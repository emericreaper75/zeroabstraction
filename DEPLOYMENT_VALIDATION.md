
## Git Rollback Strategy (Practice Rollback)

In the event of a critical failure after deploying a new release to production, you can rapidly roll back using Git. This ensures that the codebase reverts to the last known stable state and Coolify triggers a fresh, stable deployment.

### Steps to Roll Back via Git:

1. **Identify the Last Stable Commit**:
   Check your git log to find the commit hash of the last working release.
   ```bash
   git log --oneline
   ```
2. **Execute the Revert**:
   If the failure was the immediately preceding commit (e.g. `HEAD`), you can revert it directly:
   ```bash
   git revert HEAD --no-edit
   ```
   *Note: Using `git revert` is safer than `git reset --hard` because it preserves the repository's history and doesn't rewrite pushed commits, ensuring teammates and deployment pipelines don't face conflicts.*
3. **Push to Production**:
   Push the new revert commit to trigger a deployment.
   ```bash
   git push origin main
   ```
4. **Database Migrations Check**:
   If the bad release included a database migration that ran, rolling back the code does **not** roll back the database schema automatically. 
   - **Compatible schema changes** (e.g. adding a nullable column) will not break the older code.
   - **Incompatible schema changes** (e.g. dropping a table) require you to manually run the migration `down` step before pushing the revert. Run `npm run payload migrate:down` via the server terminal if necessary.

### Rollback Validation Result
- **Action**: Made a trivial text change to the homepage, committed, and built successfully.
- **Rollback**: Ran `git revert HEAD --no-edit` and verified the build succeeds again, restoring the prior state perfectly.
- **Result**: PASSED.
