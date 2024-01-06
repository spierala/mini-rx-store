
# Developing

## Setup

MiniRx Store uses [NX](https://nx.dev/) to manage several libraries and apps in the same repository.

Install the dependencies:
```shell
yarn install
```

## Run

Start the demo app with a watcher on the app and library code.
```shell
yarn dev
```

## Test

```shell
yarn test:mini-rx-store:watch
```

```shell
yarn test:mini-rx-store-ng:watch
```

## Questions and requests for support

- Start a new [Q&A Discussion](https://github.com/spierala/mini-rx-store/discussions/categories/q-a) on GitHub.

## <a name="commit"></a> Commit Message Guidelines

MiniRx follows the commit message guidelines from [Conventional Commits](https://www.conventionalcommits.org).

The commit messages are used to generate the MiniRx changelog.

### Commit Message Format

Each commit message consists of a **header**, a **body** and a **footer**. The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

Any line of the commit message cannot be longer than 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

The footer should contain a [closing reference to an issue](https://help.github.com/articles/closing-issues-via-commit-messages/) if any.

Samples:

```
feat(mini-rx-store): add trace option to Redux DevTools
```

```
fix(mini-rx-store): infer type of mapFn argument correctly
```

### Type

Must be one of the following:

- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.)
- **test**: Adding missing tests or correcting existing tests

### Scope

The scope should be the name of the npm package affected.

The following is the list of supported scopes:

- **mini-rx-store**
- **mini-rx-store-ng**
- **mini-rx-angular-demo**

### Subject

The subject contains a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also the place to
reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines.

Example:

```
feat(scope): commit message

BREAKING CHANGES:

Describe breaking changes here
```
