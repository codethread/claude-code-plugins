# dev

Phase-based development workflow for Claude Code.

## Phases

| Skill         | Purpose                                                    | Input                      | Output                        |
| ------------- | ---------------------------------------------------------- | -------------------------- | ----------------------------- |
| `dev/what`    | Define what to build through research and experimentation  | idea                       | `.dev/<feature>/prd.md`       |
| `dev/how`     | Decompose a feature PRD into ordered tasks                 | `.dev/<feature>/prd.md`    | `.dev/<feature>/tasks.yml`    |
| `dev/build`   | Implement one task for one feature (user loops externally) | `.dev/<feature>/tasks.yml` | commits + updated state files |
| `dev/systems` | Survey a repo and queue reverse-spec work                  | repo/subtree               | `specs/systems.yml`           |

## Commands

| Command                  | Purpose                                                                                       |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| `/dev:plan <idea>`       | Orchestrate blank-slate planning, then invoke `dev/what`                                      |
| `/dev:iterate <feature>` | Revise an existing PRD, then invoke `dev/what`                                                |
| `/dev:done <feature>`    | Verify a feature's tasks, write specs, squash merge, remove only that feature's dev artifacts |
| `/dev:reverse <target>`  | Reverse-engineer persistent domain specs from existing code                                   |

## Usage

```text
/dev:plan [feature idea]
# blank-slate planning
# checks planning safety, then invokes dev/what
# writes .dev/<feature>/prd.md in the current checkout

/dev:iterate [feature]
# revises an existing PRD
# useful after a fatal task or when continuing research

dev/how [feature]
# required when multiple feature PRDs exist
# writes .dev/<feature>/tasks.yml

# dev/build consults the worktree-manager agent for checkout safety
# if build says the current checkout is unsafe, create/switch isolation first
while true; do claude --print "dev/build [feature]"; done

dev/systems
# ... survey systems, save specs/systems.yml ...

# user runs reverse in a loop:
for id in $(yq -r '.systems[] | select(.status == "pending") | .id' specs/systems.yml); do
  claude --print "/dev:reverse $id"
done

/dev:done my-feature
# verifies tasks, writes specs, squash merges, removes .dev/my-feature
```

Artifacts live under `.dev/<feature>/`. This allows multiple planned features to coexist on trunk or in a shared branch without clobbering each other. Commands orchestrate the workflow and can invoke focused skills internally. `worktree-manager` owns checkout/worktree judgement for planning, build safety, and finish cleanup. `dev/how` and `dev/build` may infer the feature only when exactly one candidate exists; otherwise the user must name it explicitly.

Each feature directory is transient and removed individually when that feature ships or is abandoned. Reverse backlog planning lives in `specs/systems.yml` because it tracks persistent spec work, not per-feature scratchpad state.
