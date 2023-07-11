# Backend take-home assignment

## Context

Our company is building a LinkedIn-like application for real-estate agents. As
a backend engineer, you are building & maintaining a few endpoints that enable
our users to (1) send, (2) accept, and (3) decline friend requests, as well as
(4) view their friends' profiles.


## Overview

This take-home assignment aims to assess the followings:
  - Your competence in Javascript/TypeScript & their ecosystem
  - Your competence in SQL
  - Your ability to follow instructions
  - Your ability to adapt to a new codebase
  - Your ability to read documents
  - Your ability to "Google" & "Stackoverflow" your way to the answers


## Set-up

  1. Clone the repo to your computer
  2. Run `yarn install`
  3. Run `yarn db:push`
  4. Run `yarn test`

NOTE: Though not compulsory, it's highly recommend that you use VSCode, with
the following Extensions:

  - ESLint (enabled)
  - Prettier (disabled)


## Instructions

There are only 2 tables in our applications: `users` and `friendships`. You can
view their structures in `src/server/db/schema.prisma`.

You will be strictly working on & making changes to the following files below.
Do not create new files or make any changes to any other files in the repo.

  - `src/server/api/routers/friendship-request-router.ts`
  - `src/server/api/routers/my-friend-router.ts`
  - `src/server/tests/friendship-request.test.ts`


There are 4 questions in total. Though not enforced, we highly recommend that
you do them in order. There are further instructions embeded in the questions.

  - [Question 1](https://github.com/TheNowProject/backend-take-home-assignment/blob/main/src/server/api/routers/friendship-request-router.ts#L98)
  - [Question 2](https://github.com/TheNowProject/backend-take-home-assignment/blob/main/src/server/api/routers/friendship-request-router.ts#L128)
  - [Question 3](https://github.com/TheNowProject/backend-take-home-assignment/blob/main/src/server/api/routers/friendship-request-router.ts#L69)
  - [Question 4](https://github.com/TheNowProject/backend-take-home-assignment/blob/main/src/server/api/routers/my-friend-router.ts#L25)

NOTE: if the links to the questions do not work, you can find them in the
following files

  - `src/server/api/routers/friendship-request-router.ts`
  - `src/server/api/routers/my-friend-router.ts`

After you finish the test, do a self-assessment by completing the checklist
in the **Checklist** section below.

Finally, publish the finished repo to your Github, then send the url
to the repo via email to `binhdv@thenowproject.com.vn` and
`baotran@thenowproject.com.vn`



## Checklist

  - [ ] Attempt Question 1
  - [ ] Attempt Question 2
  - [ ] Attempt Question 3
  - [ ] Attempt Question 4
  - [ ] Finish Question 1
  - [ ] Finish Question 2
  - [ ] Finish Question 3
  - [ ] Finish Question 4
  - [ ] Run `yarn lint` with no errors
  - [ ] Run `yarn type-check` with no errors
  - [ ] Pass test Question 1 / Scenario 1
  - [ ] Pass test Question 1 / Scenario 2
  - [ ] Pass test Question 2 / Scenario 1
  - [ ] Pass test Question 3 / Scenario 1
  - [ ] Pass test Question 3 / Scenario 2
  - [ ] Pass test Question 4 / Scenario 1
  - [ ] Pass test Question 4 / Scenario 2
