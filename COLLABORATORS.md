# WooCommerce Synchrotron Collaborator Guidelines

So, you're a collaborator for Synchrotron now and have merge permissions. But
you're wondering what are the ground rules here? What's the process?

## GitHub Flow

We're using the GitHub flow process here. If you're unfamiliar,
[check it out.](https://guides.github.com/introduction/flow/)

## Guidelines

Here are the base guidelines you should know:

### Master Branch

The master branch of synchrotron should be considered to be ready for release
at all times, so it should be functional and in working condition. This doesn't
mean that features have to be fully implemented before being merged to master.
Incomplete features are fine as long as they don't break anything.

As the project matures and more people depend on it, we can look into the
use of feature flags to allow unobtrusive development progress.

### Pull Requests

All meaningful code should be in a Pull Request before being merged into
master. And each Pull Request should be reviewed by at least one other
team member before merging. This keeps the team engaged in what's going on.
It can help catch mistakes, discrepencies or even spark some conversation
that might not have otherwise happened. A simple "LGTM", :+1:(```:+1:```)
or :shipit:(```:shipit:```) comment suffices for approval.

Pull Requests can have [Status] labels which denote the current state they
are in. This helps the PR get the attention it needs through the process.

 * [Status] Needs Review
   - Put this on your PR when you're ready for others to review it.
   - Remove it when review is not desired.
 * [Status] In Progress
   - Put this on when you're working on the PR and others will wait to review further.
   - Remove it when you're done with your work.
 * [Status] Needs Author Reply
   - Put this on if you've reviewed a PR and feel your comments need answering before it's merged.
   - Remove it when you're the author and you've replied to the comments.
 * [Status] Ready to Merge
   - Put this on if you've reviewed a PR and given approval and you feel it's, well, ready to merge.

### Branching

In almost all cases, branches should try to be:

 * Short-lived, chronologically (a few weeks, at most)
 * Relatively small number of commits (<10 preferably)

Current development efforts of team members should branch on the main repo
(instead of personal forks of the repo). This allows us to work together
and see what each other are working on easier. These branches can be rebased
if needed, but communication to the rest of the team may be necessary to
ensure you don't mess up someone's local copy.

### Commits

Individual commits in each branch should be small and purposeful:

 * Single purpose
 * Atomic as possible
 * Small in size (<500 lines)
 * Have a descriptive commit title and message.

Single purpose commits can include adding a skeleton for feature, or
WIP commits that don't break anything else. Code changes can include a couple
minor spelling/grammar/style fixes as long as they are few.  A single purpose
commit could also be widespread code style fixes. Special attention should be
given to moving files or directories. These should be in their own commit with
no other meaningful changes to preserve diffs.

### Coding Standards

In general, [WordPress Coding Standards](https://codex.wordpress.org/WordPress_Coding_Standards)
should be used wherever applicable. However, this does not apply to generated
files, such as package.json.

