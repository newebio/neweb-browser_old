import { Onemitter } from "onemitter";
import React = require("react");
interface IProps {
    onemitter: Onemitter<any>;
    component: React.ComponentClass<any>;
    props: any;
}
class ReactOnemitter extends React.Component<IProps, any> {
    protected cb: (data: any) => void;
    protected emitters: {
        [index: string]: {
            onemitter: Onemitter<any>;
            cb: any;
        };
    } = {};
    public componentWillReceiveProps(nextProps: IProps) {
        const state: any = {};
        for (const propName of Object.keys(nextProps.props)) {
            if (this.state[propName] !== nextProps.props[propName]) {
                if (nextProps.props[propName] instanceof Onemitter) {
                    this.emitters[propName].onemitter.off(this.emitters[propName].cb);
                    state[propName] = nextProps.props[propName].get();
                    this.emitters[propName].onemitter = nextProps.props[propName];
                    this.emitters[propName].onemitter.on(this.emitters[propName].cb);
                } else {
                    state[propName] = nextProps.props[propName];
                }
            }
        }
        if (nextProps.onemitter !== this.props.onemitter) {
            this.props.onemitter.off(this.cb);
            state.data = nextProps.onemitter.get();
            nextProps.onemitter.on(this.cb);
        }
        this.setState(state);
    }
    public componentWillMount() {
        this.cb = (d) => {
            this.setState({ data: d });
        };
        const props: any = {};
        Object.keys(this.props.props).map((propName) => {
            if (this.props.props[propName] instanceof Onemitter) {
                this.emitters[propName] = {
                    onemitter: this.props.props[propName],
                    cb: (value: any) => {
                        this.setState({ [propName]: value });
                    },
                };
                props[propName] = this.props.props[propName].get();
                this.props.props[propName].on(this.emitters[propName].cb);
            } else {
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
    public componentWillUnmount() {
        this.props.onemitter.off(this.cb);
        Object.keys(this.emitters).map((propName) => {
            this.emitters[propName].onemitter.off(this.emitters[propName].cb);
        });
    }
    public render() {
        return React.createElement(this.props.component, this.state);
    }
}

export default ReactOnemitter;
