// Copyright 2022 Google LLC.
// SPDX-License-Identifier: Apache-2.0

import { resolve } from "path";
import bankServer from "./bank-server.js";
import attackerServer from "./attacker-server.js";

const BANK_SERVER_PORT = 4000;
const ATTACKER_SERVER_PORT = 8000;

bankServer(BANK_SERVER_PORT);
attackerServer(ATTACKER_SERVER_PORT, BANK_SERVER_PORT);
