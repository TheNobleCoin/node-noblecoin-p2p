// Copyright (c) 2020, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.

import {it, describe, before, after} from 'mocha';
import {P2P} from '../src/P2P';
import * as assert from 'assert';
import {LevinPayloads} from "turtlecoin-utils";

describe('Initialize P2P Service', function() {
    this.timeout(60 * 1000);

    const rnd = () => {
        return Math.floor(Math.random() * (65535 - 1025)) + 1025;
    }

    let server: P2P = new P2P('0.0.0.0', rnd());

    before('Initialize Server', async() => {
        return server.start();
    })

    after('Stop Server', async() => {
        return server.shutdown();
    })

    it('Connect to network', async() => {
        assert(server.connections !== 0);
    })

    it('Receives peer list', async() => {
        assert(server.peers.length !== 0);
    })

    it ('Receives Lite Block', async function() {
        this.timeout(60 * 1000);

        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => { return this.skip(); }, 50 * 1000);

            server.once('lite_block',
                (id: string, payload: LevinPayloads.LiteBlock) => {
                clearTimeout(timer);

                return resolve();
            })
        })
    })

    it('Receives New Transactions', async function () {
        this.timeout(60 * 1000);

        return new Promise((resolve) => {
            const timer = setTimeout(() => { return this.skip(); }, 50 * 1000)

            server.once('new_transactions',
                (id: string, payload: LevinPayloads.NewTransactions) => {
                clearTimeout(timer);

                return resolve();
            })
        })
    })
})
