---
'flutterwave-node-v4': minor
---

- feat: Refactor payment method interfaces and add new API contracts
  - Renamed payment method interfaces for clarity (e.g., ICard to IPmCard).
  - Introduced new API contracts for refunds, settlements, transfer recipients, senders, and virtual accounts.
  - Enhanced Http class with request/response logging based on debug level.
  - Added tests for new refund functionality and expanded transfer and wallet tests.
  - Updated index exports to include new API modules.

- feat: Introduce TransferRates API for handling international transfer rates, refactor Orchestration and PaymentMethods APIs, and enhance error handling in various methods

- feat: Enhance API structure with new exception handling, add Fees and Orders APIs, and improve query parameter handling

- feat: Enhance API functionality and add new endpoints
  - Updated Banks API to include BankAccountApiResponse and improved resolve method.
  - Implemented Chargebacks API with create, list, retrieve, and update methods.
  - Added Charges API with create, list, retrieve, and update methods.
  - Enhanced Customers API with create, list, retrieve, update, and search functionalities.
  - Introduced PaymentMethods API with create, list, and retrieve methods.
  - Refactored Builder class to support card encryption and improved parameter handling.
  - Expanded Contracts to include new interfaces for Chargebacks, Charges, Customers, and Payment methods.
  - Updated Http class to handle generic responses and improved error handling.
  - Added tests for new API functionalities including customers, payment methods, charges, and chargebacks.
  - Updated TypeScript configuration for better module resolution and type definitions.

- feat: Refactor API classes to use BaseApi for better structure and maintainability
  - Introduced BaseApi class to encapsulate all API instances.
  - Updated Banks, Chargebacks, Charges, Customers, Fees, MobileNetworks, Orchestration, Orders, PaymentMethods, RateConversion, RefundCompleted, Refunds, Settlements, TransferRecipients, TransferSenders, Transfers, VirtualAccounts, and Wallets classes to utilize the new BaseApi structure.
  - Added new error handling classes: BadRequestException, ForbiddenRequestException, HttpException, and UnauthorizedRequestException for improved error management.
  - Enhanced Http class to manage bearer tokens and debug levels.
  - Updated Flutterwave class to initialize BaseApi and manage API instances.
  - Added new Contracts for Bank API responses and country codes.
  - Implemented tests for Banks API to ensure functionality and error handling.
  - feat: Implement Builder class for URL construction and parameter handling

- feat: Add Flutterwave error interfaces for general, payment, and payout errors

- feat: Create Flutterwave response types for success and error handling

- feat: Introduce XGenericObject interface for flexible object structures

- feat: Develop Flutterwave class for API interaction and access token management

- feat: Create Http class for making API requests with axios

- feat: Add global string utility methods for case conversions and truncation

- feat: Implement helper functions for URL building and value normalization

- test: Add unit tests for Builder class functionality

- test: Create tests for Flutterwave class access token generation and error handling

- chore: Initialize TypeScript configuration and build setup

- chore: Set up Vitest for testing with coverage reporting
