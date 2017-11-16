class RunsDashboard extends React.Component {
  state = {
    runs: [],
  };

  componentDidMount() {
    this.loadRunsFromServer();
    setInterval(this.loadRunsFromServer, 5000);
  }

  loadRunsFromServer = () => {
    client.getRuns((serverRuns) => (
        this.setState({ runs: serverRuns })
      )
    );
  };

  handleCreateFormSubmit = (run) => {
    this.createRun(run);
  };

  handleEditFormSubmit = (attrs) => {
    this.updateRun(attrs);
  };


  handleTrashClick = (runId) => {
    this.deleteRun(runId);
  };

  createRun = (run) => {
    const r = helpers.newRun(run);
    this.setState({
      runs: this.state.runs.concat(r),
    });
    client.createRun(r);
  };

  updateRun = (attrs) => {
    this.setState({
      runs: this.state.runs.map((run) => {
        if (run.id === attrs.id) {
          return Object.assign({}, run, {
            length: attrs.length,
            unit: attrs.unit,
            pace: attrs.pace,
            unitPace: attrs.unitPace,
          });
        } else {
          return run;
        }
      }),
    });
    client.updateRun(attrs);
  };

  deleteRun = (runId) => {
    this.setState({
      runs: this.state.runs.filter(t => t.id !== runId),
    });
    client.deleteRun(
      { id: runId }
    );
  };

  render() {
    return (
      <div className='app container-fluid'>
          <EditableRunList
            runs={this.state.runs}
            onFormSubmit={this.handleEditFormSubmit}
            onTrashClick={this.handleTrashClick}
          />
          <ToggleableRunForm
            onFormSubmit={this.handleCreateFormSubmit}
          />
      </div>
    );
  }
}

class ToggleableRunForm extends React.Component {
  state = {
    isOpen: false,
  };

  handleFormOpen = () => {
    this.setState({ isOpen: true });
  };

  handleFormClose = () => {
    this.setState({ isOpen: false });
  };

  handleFormSubmit = (run) => {
    this.props.onFormSubmit(run);
    this.setState({ isOpen: false });
  };

  render() {
    if (this.state.isOpen) {
      return (
        <RunForm
          onFormSubmit={this.handleFormSubmit}
          onFormClose={this.handleFormClose}
        />
      );
    } else {
      return (
        <div className='ToggleableRunForm text-center'>
          <button
            className='btn'
            onClick={this.handleFormOpen}
          >
            +
          </button>
        </div>
      );
    }
  }
}

class EditableRunList extends React.Component {
  render() {

    const runs = this.props.runs.map((run) => (
      <EditableRun
        key={run.id}
        id={run.id}
        length={run.length}
        unit={run.unit}
        pace={run.pace}
        unitPace={run.unitPace}
        onFormSubmit={this.props.onFormSubmit}
        onTrashClick={this.props.onTrashClick}
      />
    ));
    return (
      <div className='panel panel-default'>
        <div className='panel-body'>
          <div className='runs row'>
            {runs}
          </div>
        </div>
      </div>
    );
  }
}

class EditableRun extends React.Component {
  state = {
    editFormOpen: false,
  };

  handleEditClick = () => {
    this.openForm();
  };

  handleFormClose = () => {
    this.closeForm();
  };

  handleSubmit = (run) => {
    this.props.onFormSubmit(run);
    this.closeForm();
  };

  closeForm = () => {
    this.setState({ editFormOpen: false });
  };

  openForm = () => {
    this.setState({ editFormOpen: true });
  };

  render() {
    if (this.state.editFormOpen) {
      return (
        <RunForm
          id={this.props.id}
          length={this.props.length}
          unit={this.props.unit}
          pace={this.props.pace}
          unitPace={this.props.unitPace}
          onFormSubmit={this.handleSubmit}
          onFormClose={this.handleFormClose}
        />
      );

    } else {
      return (
        <Run
          id={this.props.id}
          length={this.props.length}
          unit={this.props.unit}
          pace={this.props.pace}
          unitPace={this.props.unitPace}
          onEditClick={this.handleEditClick}
          onTrashClick={this.props.onTrashClick}
        />
      );
    }
  }
}

class Run extends React.Component {
  componentDidMount() {
    this.forceUpdateInterval = setInterval(() => this.forceUpdate(), 50);
  }

  componentWillUnmount() {
    clearInterval(this.forceUpdateInterval);
  }

  handleTrashClick = () => {
    this.props.onTrashClick(this.props.id);
  };

  render() {

    return (
      <div className='run col-xs-6 col-md-3'>
        <div className='thumbnail'>
        <div className='panel-body'>
          <div className='h4'>
            {this.props.length}
            <span> {this.props.unit}</span>
          </div>
          <div className='h4'>
            {this.props.pace}
            <span> {this.props.unitPace}</span>
          </div>
          <div style={{float:'right'}}>
            <span
              onClick={this.handleTrashClick}>
              <i className="glyphicon glyphicon-trash"/>
            </span>
            <span
              onClick={this.props.onEditClick}
            >

              <i className="glyphicon glyphicon-edit" />
            </span>
          </div>
        </div>
        </div>

      </div>
    );
  }
}

class RunForm extends React.Component {
  state = {
    length: this.props.length || '',
    unit: this.props.unit || '',
    pace: this.props.pace || '',
    unitPace: this.props.unitPace || '',
  };

  handleLengthChange = (e) => {
    this.setState({ length: e.target.value });
  };

  handleUnitChange = (e) => {
    this.setState({ unit: e.target.value });
  };

  handlePaceChange = (e) => {
    this.setState({ pace: e.target.value });
  };

  handleUnitPaceChange = (e) => {
    this.setState({ unitPace: e.target.value });
  };

  handleSubmit = () => {
    this.props.onFormSubmit({
      id: this.props.id,
      length: this.state.length,
      unit: this.state.unit,
      pace: this.state.pace,
      unitPace: this.state.unitPace,
    });
  };

  render() {
    const submitText = this.props.id ? 'Update' : 'Create';
    return (
      <div className='run-form panel-body thumbnail' style={{margin:0 + ' auto', overflow:'hidden', width:25+'%'}} >
            <div className='field'>
              <label className="label label-default">Length</label>
              <input className="form-control"
                type='text'
                value={this.state.length}
                onChange={this.handleLengthChange}
              />
            </div>
            <div className='field'>
              <label className="label label-default">Unit</label>
              <input className="form-control"
                type='text'
                value={this.state.unit}
                onChange={this.handleUnitChange}
              />
            </div>
            <div className='field'>
              <label className="label label-default">Pace</label>
              <input className="form-control"
                type='text'
                value={this.state.pace}
                onChange={this.handlePaceChange}
              />
            </div>
            <div className='field'>
              <label className="label label-default">Unit Pace</label>
              <input className="form-control"
                type='text'
                value={this.state.unitPace}
                onChange={this.handleUnitPaceChange}
              />
            </div>
            <div className='buttons'>
              <button
                className='btn'
                onClick={this.handleSubmit}
              >
                {submitText}
              </button>
              <button
                className='btn'
                onClick={this.props.onFormClose}
              >
                Cancel
              </button>
            </div>

      </div>
    );
  }
}

ReactDOM.render(
  <RunsDashboard />,
  document.getElementById('content')
);
