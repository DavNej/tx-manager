# Transactions manager

## Instructions

Develop a transaction management module that simulate transaction process

## Responsibilities

- Manage payments
- Trigger transactions
- Validate transactions
- Schedule transactions
- Errors handling

## Objectives

### 1. Backend (Nest.js or Node.js / PostgreSQL) => REST API

- Creation of transactions (`amount` from `sender` to `receiver`)
- Schedule future transactions.
- Transaction status management (`pending`, `scheduled`, `completed`, `failed`)
- Implementation (or at least design on paper) of a error handling mechanism (from code or API) (see 3.)
- Data persistence with PostgreSQL

NB: A transaction is actually carried out by calling an external API (typically that of a payment service provider. A payment service provider who “hosts” users' wallets). You can therefore call an imaginary function coded beforehand and requesting this API.

### 2. Frontend (Next.js)

- Create manual and scheduled transactions
- View transaction history and status
- Manage transaction errors and retry transactions manually

### 3. Error management and resilience

- Implement error management
- Manage scenarios where a transaction fails

### 4. Autonomy and proactivity

- Make choices in terms of architecture, code organization and good development practices.
- Suggest improvements or additional features related to transaction resilience or user experience will be a plus.

## Technical details

Tests (recommended):

- Write at least part of the tests that would validate the main features. In addition, don't hesitate to think about how to test the third-party transaction API (to test both its integration with the code and the API itself. Identify any regressions).

Bonus:

- Add a notification system to inform the user in real time of the status of his or her transactions (e.g. WebSockets).
- Design a scalable architecture for the transactional service, which you will present orally.

## Evaluation criteria

- Code quality: Cleanliness, organization and readability of the code.
- Error handling: Robustness of the system in the event of breakdowns or transaction failures.
- Autonomy and proactivity: Ability to make technical choices, anticipate problems and propose solutions.
- User experience: Fluidity and simplicity of the user interface.
- Testing: Presence and quality of tests.

## Deliverables

- Project source code (via GitHub or other repository).
- A (very) brief documentation of how the system works, explaining technical choices.
- Optional: a short report on any areas of improvement you've identified for transaction management (linked to point 3 of the “Bonus” section)
