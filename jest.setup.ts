import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import { TextEncoder, TextDecoder } from 'util';
import { fetch, Request, Response } from 'node-fetch';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;
global.fetch = fetch as any;
global.Request = Request as any;
global.Response = Response as any; 