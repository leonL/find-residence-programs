import React, { Component } from "react";
import PropTypes from "prop-types";
import { css } from "emotion";
import styled from "@emotion/styled";
import ReactModal from "react-modal";
import { Grid } from "@material-ui/core/";

import { globalTheme } from "../theme";
const modalStyles = { overlay: { zIndex: 100 } };

const modalCSS = css`
  position: absolute;
  top: 20%;
  left: 25%;
  right: 25%;
  border: 0;
  background: rgb(255, 255, 255);
  overflow: auto;
  outline: none;
  padding: 0;
  @media only screen and (max-width: ${globalTheme.max.md}) {
    left: 20%;
    right: 20%;
  }
  @media only screen and (max-width: ${globalTheme.max.sm}) {
    left: 10%;
    right: 10%;
  }
  @media only screen and (max-width: ${globalTheme.max.xs}) {
    left: 10px;
    right: 10px;

    input {
      width: 100%;
    }
    .copyButton {
      width: 100%;
      margin: auto;
    }
  }
`;

const header = css`
  background-color: ${globalTheme.colour.blackBlue};
  color: ${globalTheme.colour.white};
  padding: 0.75em 1.1em;
  font-size: 22px;
  font-family: ${globalTheme.fontFamilySansSerif};
  font-weight: 700;
`;

const bodyStyle = css`
  padding: 1.5em;
  font-family: ${globalTheme.fontFamilySansSerif};
  font-weight: 700;
`;

const URLInputBox = styled("input")({
  width: "100%",
  height: "44px",
  padding: "9px 19px 8px 19px",
  margin: 0,
  border: 0,
  boxSizing: "border-box",
  fontFamily: globalTheme.fontFamilySansSerif,
  color: globalTheme.colour.navy,
  fontWeight: "bold",
  textTransform: "none",
  fontSize: "18px",
  lineHeight: "1.5",
  background: globalTheme.colour.paleGreyTwo,
  borderRadius: 0,
  boxShadow: "inset 0 0 0 9999px f4f7f9", // keeps chrome autofill from changing background colour
  WebkitAppearance: "none",
  ":focus": {
    marginRight: "3px",
    outline: `3px solid ` + globalTheme.colour.focusColour,
    outlineOffset: 0,
    " ~ button": {
      width: "46px"
    }
  }
});

const CopyButton = styled("button")({
  backgroundColor: globalTheme.colour.blackBlue,
  cursor: "pointer",
  width: "100%",
  border: 0,
  color: globalTheme.colour.white,
  fontFamily: globalTheme.fontFamilySansSerif,
  fontWeight: "bold",
  fontSize: "22px",
  lineHeight: "23px",
  position: "relative",
  padding: ".526315em 1em",
  backgroundPosition: "2px 50%",
  ":focus": {
    outlineOffset: 0,
    outline: `3px solid ` + globalTheme.colour.focusColour
  },
  ":hover": {
    backgroundColor: globalTheme.colour.navy
  }
});

const CloseButton = styled("button")({
  float: "right",
  backgroundColor: globalTheme.colour.blackBlue,
  height: "100%",
  cursor: "pointer",
  fontSize: "24px",
  fontWeight: "900",
  padding: 0,
  border: 0,
  color: globalTheme.colour.white
});
const topMargin = css`
  margin-top: 1em;
`;

class ShareModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      statusMessage: "",
      origin: ""
    };
    this.copyText = this.copyText.bind(this);
  }
  componentDidMount() {
    this.setState({ origin: window.location.origin });
  }

  copyText(e) {
    let t = e.target.dataset.copytarget;
    let shareInput = t ? document.querySelector(t) : null;
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareInput.value).then(() => {
          this.setState({ statusMessage: this.props.t("share.link_copied") });
        });
      } else {
        // fix for iOS:
        // handle iOS as a special case
        if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
          // create a selectable range
          var range = document.createRange();
          range.selectNodeContents(shareInput);

          // select the range
          var selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          shareInput.setSelectionRange(0, 999999);

          // restore contentEditable/readOnly to original state
        } else {
          shareInput.select();
        }

        document.execCommand("copy");

        shareInput.blur();

        this.setState({ statusMessage: this.props.t("share.link_copied") });
      }
    } catch (err) {
      this.setState({ statusMessage: this.props.t("share.not_supported") });
    }
  }
  close(closeModalFn) {
    this.setState({ statusMessage: "" });
    closeModalFn();
  }

  render() {
    const { uid, isOpen, onRequestClose, closeModal, t } = this.props;
    const shareTargetId = uid + "shareTarget";
    let iOS = false;
    if (global.navigator) {
      let userAgent = navigator.userAgent;

      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        iOS = true;
      }
    }
    let inputBox = iOS ? (
      <URLInputBox
        type="text"
        id={shareTargetId}
        defaultValue={this.state.origin + this.props.url.asPath}
        contentEditable="true"
        readOnly={false}
      />
    ) : (
      <URLInputBox
        type="text"
        id={shareTargetId}
        value={this.state.origin + this.props.url.asPath}
        readOnly
      />
    );
    // Only render modal on the client - portals are not supported on the server and fail tests
    if (process.browser) {
      return (
        <ReactModal
          style={modalStyles}
          className={modalCSS}
          isOpen={isOpen}
          onRequestClose={() => this.close(onRequestClose)}
        >
          <div className={header}>
            <span>{t("titles.share")}</span>
            <CloseButton onClick={() => this.close(closeModal)}>X</CloseButton>
          </div>
          <div className={bodyStyle}>
            <p>
              <label htmlFor={shareTargetId}>{t("share.copy_prompt")}</label>
            </p>
            <Grid container spacing={8}>
              <Grid item xs={12} sm={9}>
                {inputBox}
              </Grid>
              <Grid item xs={12} sm={3}>
                <CopyButton
                  className="copyButton"
                  data-copytarget={"#" + shareTargetId}
                  onClick={this.copyText}
                >
                  {t("share.copy_button")}
                </CopyButton>
              </Grid>
            </Grid>

            <div className={topMargin}>{this.state.statusMessage}</div>
          </div>
        </ReactModal>
      );
    } else {
      return <div />;
    }
  }
}

ShareModal.propTypes = {
  uid: PropTypes.string.isRequired,
  className: PropTypes.string,
  isOpen: PropTypes.bool,
  onRequestClose: PropTypes.func,
  closeModal: PropTypes.func,
  url: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};
if (process.browser) ReactModal.setAppElement("#main");
ReactModal.defaultStyles.overlay.backgroundColor = "rgba(30,30,30,0.75)";

export default ShareModal;
