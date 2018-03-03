"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const onemitter_1 = require("onemitter");
const React = require("react");
class ReactOnemitter extends React.Component {
    constructor() {
        super(...arguments);
        this.emitters = {};
    }
    componentWillReceiveProps(nextProps) {
        const state = {};
        for (const propName of Object.keys(nextProps.props)) {
            if (this.state[propName] !== nextProps.props[propName]) {
                state[propName] = nextProps.props[propName];
            }
        }
        if (nextProps.onemitter !== this.props.onemitter) {
            this.props.onemitter.off(this.cb);
            state.data = nextProps.onemitter.get();
            nextProps.onemitter.on(this.cb);
        }
        this.setState(state);
    }
    componentWillMount() {
        this.cb = (d) => {
            this.setState({ data: d });
        };
        const props = {};
        Object.keys(this.props.props).map((propName) => {
            if (this.props.props[propName] instanceof onemitter_1.Onemitter) {
                this.emitters[propName] = {
                    onemitter: this.props.props[propName],
                    cb: (value) => {
                        this.setState({ [propName]: value });
                    },
                };
                props[propName] = this.props.props[propName].get();
                this.props.props[propName].on(this.emitters[propName].cb);
            }
            else {
                props[propName] = this.props.props[propName];
            }
        });
        const data = this.props.onemitter.get();
        if (data) {
            props.data = data;
        }
        this.setState(props);
        this.props.onemitter.on(this.cb);
    }
    componentWillUnmount() {
        this.props.onemitter.off(this.cb);
        Object.keys(this.emitters).map((propName) => {
            this.emitters[propName].onemitter.off(this.emitters[propName].cb);
        });
    }
    render() {
        return React.createElement(this.props.component, this.state);
    }
}
exports.default = ReactOnemitter;
