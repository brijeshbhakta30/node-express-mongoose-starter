# node-express-mongoose-starter

A Boilerplate application for building REST APIs using node, express and mongoose

## Notes

- commit messages are validated by [this](https://www.conventionalcommits.org) convention.
- [Airbnb's javascript style guide](https://github.com/airbnb/javascript) and [eslint config](https://www.npmjs.com/package/eslint-config-airbnb-base) is followed.
- Code depends on `.env` files and will validate the files to run properly.
- To reflect changes in `.env` files, a restart will be required.
- Staged files will be fixed for linting error before commit by [eslint](https://eslint.org/), [husky](https://www.npmjs.com/package/husky) and [lint-staged](https://www.npmjs.com/package/lint-staged).

### Install dependencies

```sh
npm i
```

### To setup the project

- Create environment files according to environment like `.env.development` by copying the `.env.example` file and add respective values. Create one for each environment.

### To run the project in development

```sh
npm run dev
```

### Tests:

##### For Test cases

```sh
npm run test
```

##### For Linting files

```sh
npm run lint
```

##### For Code Coverage

```sh
npm run test:coverage
```
