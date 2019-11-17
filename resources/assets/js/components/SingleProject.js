import axios from "axios";
import React, { Component } from "react";

class SingleProject extends Component {
    constructor(props) {
        super(props);
        // console.log(props)
        this.state = {
            project: {},
            tasks: [],
            title: "",
            errors: []
        };
    }

    handleFieldChange(e) {
        this.setState({
            title: e.target.value
        });
    }
    handleMarkTaskAsCompleted(taskId) {
        console.log(taskId);
        axios.put(` api/task/${taskId} `).then(response => {
            this.setState(prevState => ({
                tasks: prevState.tasks.filter(task => {
                    return task.id !== taskId;
                })
            }));
        });
    }

    handleAddNewTask(e) {
        e.preventDefault();
        const task = {
            title: this.state.title,
            project_id: this.state.project.id
        };

        axios
            .post("/api/task", task)
            .then(response => {
                console.log(response);
                //clear form input
                this.setState({
                    title: ""
                });
                //add project to a list
                this.setState(prevState => ({
                    tasks: prevState.tasks.concat(response.data)
                }));
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    error: error.response.data.errors
                });
            });
    }

    hasErrorFor(field) {
        return !!this.state.errors[field];
    }

    renderErrorFor(field) {
        if (this.hasErrorFor(field)) {
            return (
                <span className="invalid-feedback">
                    <strong>{this.state.errors[field][0]}</strong>
                </span>
            );
        }
    }

    markProjectAsCompleted() {
        const { history } = this.props;
        axios
            .put(`/api/project/${this.state.project.id}`)
            .then(response => history.push("/"));
    }

    componentDidMount() {
        const projectId = this.props.match.params.id;
        return axios.get(`/api/project/${projectId}`).then(response => {
            this.setState({
                project: response.data,
                tasks: response.data.tasks
            });
        });
    }

    render() {
        const { project, tasks } = this.state;

        return (
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header">{project.name}</div>
                            <div className="card-body">
                                <p>{project.description}</p>

                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() =>
                                        this.markProjectAsCompleted()
                                    }
                                >
                                    Mark as completed
                                </button>

                                <hr />

                                <form onSubmit={e => this.handleAddNewTask(e)}>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            name="title"
                                            className={`form-control ${
                                                this.hasErrorFor("title")
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            placeholder="Task title"
                                            value={this.state.title}
                                            onChange={e =>
                                                this.handleFieldChange(e)
                                            }
                                        />
                                        <div className="input-group-append">
                                            <button className="btn btn-primary">
                                                Add
                                            </button>
                                        </div>
                                        {this.renderErrorFor("title")}
                                    </div>
                                </form>

                                <ul className="list-group mt-3">
                                    {tasks.map(task => (
                                        <li
                                            className="list-group-item d-flex justify-content-between align-items-center"
                                            key={task.id}
                                        >
                                            {task.title}

                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() =>
                                                    this.handleMarkTaskAsCompleted(
                                                        task.id
                                                    )
                                                }
                                            >
                                                Mark as completed
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SingleProject;
