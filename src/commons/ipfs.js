import { Keyring } from '@polkadot/api';
import {create} from 'ipfs-http-client';
// const seeds = process.env.REACT_APP_CRUST_SEED;
// const keyring = new Keyring();
// const pair = keyring.addFromUri(seeds);
// const sig = pair.sign(pair.address);
// const sigHex = '0x' + Buffer.from(sig).toString('hex');
// console.log(`sub-${pair.address}:${sigHex}`)

// const authHeader = Buffer.from(`sub-${pair.address}:${sigHex}`).toString('base64');
const authHeader = Buffer.from(`sub-5Cf4bcx83C4iBoaw6dyWnE78rmzhk8C9uQ36eU87QyzExxje:0x9159f9b0a07f3fad1aa6c7272c1d06b90eea77310434f10b531c6512e740628da42603d009a9da3ca03065480189dbbfb8fd78ae2ac6c4875d0f3cbbca652409`).toString('base64');
const ipfsGateway = 'https://crustwebsites.net';

const ipfs = create({
    url: ipfsGateway + '/api/v0',
    headers: {
        authorization: 'Basic ' + authHeader
    }
});

// const ipfs = create({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

export default ipfs;