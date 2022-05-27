import process from 'process';
import { Buffer } from 'buffer';
import EventEmitter from 'events';

window.Buffer = Buffer;
window.process = process;
(<any>window).EventEmitter = EventEmitter;
window.global = window;
