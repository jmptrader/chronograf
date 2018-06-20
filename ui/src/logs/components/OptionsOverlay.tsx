import React, {Component} from 'react'
import uuid from 'uuid'
import Container from 'src/shared/components/overlay/OverlayContainer'
import Heading from 'src/shared/components/overlay/OverlayHeading'
import Body from 'src/shared/components/overlay/OverlayBody'
import ColorDropdown, {Color} from 'src/logs/components/ColorDropdown'

import {DEFAULT_SEVERITY_LEVELS} from 'src/logs/constants'

interface SeverityConfig {
  severity: string
  default: Color
  override?: Color
}

interface Props {
  onDismissOverlay: () => void
  severityConfigs: SeverityConfig[]
}

interface State {
  workingSeverityConfigs: SeverityConfig[]
}

class OptionsOverlay extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      workingSeverityConfigs: this.props.severityConfigs,
    }
  }

  public render() {
    const {onDismissOverlay} = this.props

    return (
      <Container maxWidth={700}>
        <Heading title="Configure Log Viewer" onDismiss={onDismissOverlay} />
        <Body>
          <div className="row">
            <div className="col-sm-6">
              <label className="form-label">Customize Severity Colors</label>
              {this.severityConfigs}
              <button
                className="btn btn-sm btn-default btn-block"
                onClick={this.handleResetSeverity}
              >
                <span className="icon refresh" />
                Reset to Defaults
              </button>
            </div>
            <div className="col-sm-6">
              <label className="form-label">Order Table Columns</label>
              <p>Column re-ordering goes here</p>
            </div>
          </div>
        </Body>
      </Container>
    )
  }

  private get severityConfigs(): JSX.Element {
    const {workingSeverityConfigs} = this.state

    return (
      <div className="logs-options--color-list">
        {workingSeverityConfigs.map(config => (
          <div key={uuid.v4()} className="logs-options--color-row">
            <div className="logs-options--color-column">
              <div className="logs-options--label">{config.severity}</div>
            </div>
            <div className="logs-options--color-column">
              <ColorDropdown
                selected={config.override || config.default}
                onChoose={this.handleChangeColor(config.severity)}
                stretchToFit={true}
              />
            </div>
          </div>
        ))}
      </div>
    )
  }

  private handleResetSeverity = (): void => {
    this.setState({workingSeverityConfigs: DEFAULT_SEVERITY_LEVELS})
  }

  private handleChangeColor = (severity: string) => (override: Color): void => {
    const workingSeverityConfigs = this.state.workingSeverityConfigs.map(
      config => {
        if (config.severity === severity) {
          return {...config, override}
        }

        return config
      }
    )

    this.setState({workingSeverityConfigs})
  }
}

export default OptionsOverlay
