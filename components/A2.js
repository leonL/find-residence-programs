// @flow

import React, { Component } from "react";
import { Grid } from "material-ui";
import Link from "next/link";
import SelectButton from "../components/select_button";

type Props = {
  t: mixed,
  storeHydrated: boolean,
  patronTypes: mixed,
  url: mixed,
  selectedPatronTypes: mixed,
  switchSection: mixed
};

export class App extends Component<Props> {
  props: Props;

  constructor() {
    super();
    this.state = {
      patronTypes: [],
      selectedPatronTypes: []
    };
  }

  componentWillMount() {
    this.setState({
      selectedPatronTypes: this.props.selectedPatronTypes
    });
  }

  toggleButton = id => {
    let selected = this.state.selectedPatronTypes;
    const index = selected.indexOf(id);
    if (index >= 0) {
      selected.splice(index, 1);
    } else {
      selected.push(id);
    }
    this.setState({
      selectedPatronTypes: selected
    });
  };

  render() {
    const { t } = this.props; // eslint-disable-line no-unused-vars

    return (
      <div style={{ padding: 12 }}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <h1 style={{ textAlign: "center" }}>
              {t("A2.What best describes your status?")}
            </h1>
          </Grid>
        </Grid>

        {this.props.patronTypes.map((type, i) => (
          <Grid
            container
            key={i}
            justify="center"
            spacing={24}
            style={{ marginTop: "1em" }}
          >
            <Grid item sm={4} xs={12}>
              <SelectButton
                id={type.id}
                text={
                  t("current-language-code") === "en"
                    ? type.name_en
                    : type.name_fr
                }
                onClick={this.toggleButton}
                isDown={this.state.selectedPatronTypes.indexOf(type.id) >= 0}
              />
            </Grid>
          </Grid>
        ))}

        <Grid
          container
          justify="center"
          spacing={24}
          style={{ marginTop: "3em" }}
        >
          <Grid item sm={4} xs={12}>
            <SelectButton
              text={t("A2.See Results")}
              onClick={() => this.props.switchSection("A3", this.state)}
              isDown={false}
            />
          </Grid>
        </Grid>

        <Grid
          container
          justify="center"
          spacing={24}
          style={{ marginTop: "1em" }}
        >
          <Grid item sm={4} xs={12}>
            <p style={{ textAlign: "center", fontSize: "1em" }}>
              <Link href="all-benefits">
                <a>{t("Show All Benefits")}</a>
              </Link>
            </p>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default App;