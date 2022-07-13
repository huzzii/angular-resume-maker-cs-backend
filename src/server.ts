import * as  express from 'express';
import * as mongoose from "mongoose";
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import {environment} from "./environments/environment.dev";
import {join} from "path";
import {Request, Response} from "express";


export class Server {
    corsOptions: cors.CorsOptions = {
        allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token", "Authorization"],
        credentials: true,
        methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
        origin: '*',
        preflightContinue: false
    };
    public app: express.Application;
    // DIST_FOLDER = join(process.cwd(), 'dist');
    // APP_NAME = 'resume-builder';

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    config() {
        const MONGO_URI: string = environment.db_url;
        mongoose.connect(MONGO_URI).then(() => {
            console.log('connected to database');
        }).catch(err => {
            console.log('error hai', err);
        });
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(bodyParser.json());
        this.app.use('*', cors(this.corsOptions));
    }

    routes() {
        this.app.use(this.logErrors);
        this.app.use(this.errorHandle);
    }

    errorHandle(error, req, res, next) {
        {
            res.status(error.status || 500);
            res.json({
                error: error.message
            })
        }
    }

    logErrors(req, res, next) {
        let error: any;
        error = new Error('Not Found');
        error.status = 404;
        next(error)
    }
}

export default new Server().app;
