import { List, Input, Button, Tooltip } from "antd";
import { PlusOutlined, DeleteTwoTone } from "@ant-design/icons";
import { WidgetWrapper } from "../commons/widget-wrapper";
import styled from "styled-components";
import {
  LIGHTBLUE,
  SPACE,
  SPACE_SM,
  SPACE_XS,
  MAINBLUE,
  SPACE_MD,
  G70,
  WHITE,
  BLACK
} from "../styles/style.constant";
import { SidebarListTitle } from "./sidebar-list-title";
import { ScTooltip } from "../commons/sc-tooltip";
import { Collapsable, ActivatedWidget } from "../models/views/generic.model";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StoreDispatch } from "../store";
import { ManualSignReducerRootState } from "../pages/manual-sign-page/reducer";
import { selectAllSignsetDetails, selectClickedWidget } from "../pages/manual-sign-page/reducer/selectors/signsets-details.selector";
import { signsetsDetailsActions } from "../pages/manual-sign-page/reducer/slices/signsets-details.slice";
import { documentsDetailsActions } from "../pages/manual-sign-page/reducer/slices/documents-details.slice";
import { selectDocumentDetailsSignerEmail, selectDocumentDetailsSignsetList } from "../pages/manual-sign-page/reducer/selectors/documents-details.selector";
import { reactLibraryFormatter } from "../utils/manual-sign-doc.util";
import isEmail from 'email-validator';

interface SidebarContentProps extends Collapsable {
  widgetListData?: any[];
}

interface WrapperProps extends ActivatedWidget {
  collapsed: boolean;
  signsetList: any;
}

export const DraggableWidgetsSidebarContent = ({
  collapsed,
  widgetListData = [],
}: SidebarContentProps) => {
  const dispatch = useDispatch<StoreDispatch>();
  const signsetList = useSelector((state: ManualSignReducerRootState) => selectDocumentDetailsSignsetList(state));
  const selectedClickedWidget = useSelector((state: ManualSignReducerRootState) => selectClickedWidget(state));
  const signerEmail = useSelector((state: ManualSignReducerRootState) => selectDocumentDetailsSignerEmail(state));
  const [addSigner, setAddSigner] = useState(false);
  const signerListRef = useRef<any>(null);
  const allSignsetDetails = useSelector((state: ManualSignReducerRootState) => selectAllSignsetDetails(state));


  const [widgetType, setWidgetType] = useState("");
  const [activeWidgets, setActiveWidgets] = useState<any[]>([]);
  const [activeWidget, setActiveWidget] = useState({ active: false });
  const [currentSignerList, setCurrentSignerList] = useState<any[]>([]);
  const [email, setEmail] = useState(''); // Initialize with an empty string
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isDuplicateEmail, setIsDuplicateEmail] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [onSubmit, setOnSubmit] = useState(false);

  const handleChangeActiveWidget = (type: string) => {
    const selectedActiveWidget = activeWidgets.find((widget) => widget.type === type);
    const updatedSelectedActiveWidget = { ...selectedActiveWidget, active: true };
    setActiveWidget(updatedSelectedActiveWidget);
    setWidgetType(type);
  }

  const hasDuplicateEmail = (list: any, email: any) => {
    return list.some((signer: any) => signer.value === email);
  };
  const handleEmailChange = (e: any) => {
    const inputValue = e.target.value;
    setEmail(inputValue);

    if (onSubmit) {
      if (inputValue === "") {
        setIsValidEmail(true);
        setIsDuplicateEmail(false)
      }
    }

  }

  // useEffect(() => {
  //   if (signers.length !== 0) {
  //     const allSignset = reactLibraryFormatter({ signsets: allSignsetDetails });
  //     let resultArrays = signers.map((signer: any) => {
  //       const matchingSignsets = allSignset.filter((item) => item.email === signer);
  //       return {
  //         email: signer,
  //         signset: matchingSignsets, // Update signset with an array of matching signsets
  //       };
  //     });

  //     // Remove the 'email' property from the 'signset' objects
  //     resultArrays.forEach((item: any) => {
  //       item.signset.forEach((signsetItem: any) => {
  //         signsetItem.top = Math.round(signsetItem.top);
  //         signsetItem.left = Math.round(signsetItem.left);
  //         delete signsetItem.email;
  //       });
  //     });

  //   }
  //   else {
  //     setAddSigner(true);
  //   }

  // }, [signers])


  useEffect(() => {
    if (signsetList.length !== 0) {
      const allSignset = reactLibraryFormatter({ signsets: allSignsetDetails });
      let resultArrays = signsetList.map((signer: any) => {
        const matchingSignsets = allSignset.filter((item) => item.email === signer.email);
        return {
          email: signer.email,
          signset: matchingSignsets, // Update signset with an array of matching signsets
        };
      });

      // Remove the 'email' property from the 'signset' objects
      resultArrays.forEach((item: any) => {
        item.signset.forEach((signsetItem: any) => {
          signsetItem.top = Math.round(signsetItem.top);
          signsetItem.left = Math.round(signsetItem.left);
          delete signsetItem.email;
        });
      });

    }
    else {
      setAddSigner(true);
    }

  }, [signsetList])

  // const handleAddSigner = () => {
  //   const isValid = isEmail.validate(email);

  //   if (isValid) {
  //     setIsValidEmail(true);
  //     setOnSubmit(true);
  //     setIsDuplicateEmail(false);
  //     setCurrentSignerList((prevSignerList) => {
  //       if (hasDuplicateEmail(prevSignerList, email)) {
  //         setIsDuplicateEmail(true);
  //         // You may want to handle the duplicate email case differently (e.g., show an error message).
  //       } else {
  //         const updatedSignerList = [...prevSignerList, { value: email, label: email }];
  //         const changeSignerListFormat = updatedSignerList.map((signer) => signer.value);
  //         dispatch(documentsDetailsActions.setSigners(changeSignerListFormat));
  //         setEmail('');
  //         setAddSigner(false);
  //       }
  //       return prevSignerList;
  //     });

  //   }
  //   else {
  //     setIsValidEmail(false);
  //     setIsDuplicateEmail(false);
  //     setOnSubmit(true);
  //   }
  // }

  const handleAddSigner = () => {
    const isValid = isEmail.validate(email);

    if (!isValid) {
      setIsValidEmail(false);
      setIsDuplicateEmail(false);
      setOnSubmit(true);
      return;
    }

    if (hasDuplicateEmail(currentSignerList, email)) {
      setIsValidEmail(true);
      setIsDuplicateEmail(true);
      setOnSubmit(true);
      return;
    }

    const updatedSignerList = [...currentSignerList, { value: email, label: email }];
    const changeSignerListFormat = updatedSignerList.map((signer) => ({ email: signer.value, signset: [] }));

    setIsValidEmail(true);
    setIsDuplicateEmail(false);
    setOnSubmit(true);
    setCurrentSignerList(updatedSignerList);
    dispatch(documentsDetailsActions.setSignsetList(changeSignerListFormat));
    setEmail('');
    setAddSigner(false);
  }

  useEffect(() => {
    if (selectedClickedWidget === "") {
      const selectedActiveWidget = activeWidgets.find((widget) => widget.type === widgetType);
      const updatedSelectedActiveWidget = { ...selectedActiveWidget, active: false };
      setActiveWidget(updatedSelectedActiveWidget)
    }
  }, [selectedClickedWidget])

  useEffect(() => {
    if (activeWidget.active) {
      dispatch(signsetsDetailsActions.setSelectedClickedWidget(widgetType));
    }
    else {
      dispatch(signsetsDetailsActions.setSelectedClickedWidget(""));
    }
  }, [activeWidget])

  useEffect(() => {
    const updatedWidgetListData = widgetListData.map((widget) => { return { ...widget, active: false }; })
    setActiveWidgets(updatedWidgetListData);
  }, [widgetListData])

  useEffect(() => {
    if (signsetList.length !== 0) {
      const currentSigners = signsetList.map((signer: any) => {
        return { value: signer.email, label: signer.email };
      })
      setCurrentSignerList(currentSigners);
      dispatch(documentsDetailsActions.setSignerEmail(currentSigners[0].value)); // Set the index of signer
    }
    else {
      dispatch(documentsDetailsActions.setSignerEmail("")); // Set the index of signer
    }
  }, [signsetList])

  useEffect(() => {
    if (signerListRef.current && currentSignerList.length > 4) {
      const container = signerListRef.current;
      container.scrollTo({
        top: container.scrollHeight, // Scroll to the bottom
        behavior: "smooth",
      });
    }

  }, [currentSignerList]);

  useEffect(() => {
    if (showMessage) {
      setTimeout(() => setShowMessage(false), 3000);
    }

    if (email === "") {
      setShowMessage(false);
      setIsDuplicateEmail(false);
      setIsValidEmail(true);
    }
  }, [showMessage, email])

  return (
    <Wrapper collapsed={collapsed} isActive={activeWidget.active} signsetList={signsetList}>
      <>
        <SidebarListTitle
          collapsed={collapsed}
          title="Signers"
          tooltipDescription={"Choose the signer to set the attributes"}
        />
        {collapsed ?
          <CollapsedSigners>
            {currentSignerList.length === 0 ? (
              <CollapsedEmpty title="No signers yet">—</CollapsedEmpty>
            ) : (
              currentSignerList.map((signer) => {
                const selected = signerEmail === signer.value;
                const initial = (signer.value || "?").charAt(0).toUpperCase();
                return (
                  <Tooltip key={signer.value} title={signer.label} placement="right" color={MAINBLUE}>
                    <CollapsedAvatar
                      $selected={selected}
                      onClick={() => dispatch(documentsDetailsActions.setSignerEmail(signer.value))}
                    >
                      {initial}
                    </CollapsedAvatar>
                  </Tooltip>
                );
              })
            )}
          </CollapsedSigners>
          :
          <SignersPanel>
            {currentSignerList.length === 0 && !addSigner && (
              <EmptyHint>No signers yet. Add one to get started.</EmptyHint>
            )}

            {currentSignerList.length > 0 && (
              <SignersList ref={signerListRef} $scroll={currentSignerList.length > 4}>
                {currentSignerList.map((signer) => {
                  const selected = signerEmail === signer.value;
                  const initial = (signer.value || "?").charAt(0).toUpperCase();
                  return (
                    <SignerRow
                      key={signer.value}
                      $selected={selected}
                      onClick={() => dispatch(documentsDetailsActions.setSignerEmail(signer.value))}
                    >
                      <SignerAvatar $selected={selected}>{initial}</SignerAvatar>
                      <SignerEmail title={signer.value}>{signer.label}</SignerEmail>
                      <DeleteIconBtn
                        type="text"
                        size="small"
                        icon={<DeleteTwoTone twoToneColor="#ff4d4f" />}
                        aria-label="Remove signer"
                        onClick={(e: MouseEvent<HTMLElement>) => {
                          e.stopPropagation();
                          const updatedSignerList = currentSignerList.filter((userEmail) => userEmail.value !== signer.value);
                          const changeSignsetListFormat = signsetList.filter((signsetItem: any) => signsetItem?.email !== signer.value);
                          const updatedSignsetList = allSignsetDetails.filter((signsetItem) => signsetItem?.signerEmail !== signer.value);

                          setCurrentSignerList(updatedSignerList);
                          dispatch(documentsDetailsActions.setSignsetList(changeSignsetListFormat));
                          dispatch(signsetsDetailsActions.setInitialSignsetsDetails(updatedSignsetList));
                        }}
                      />
                    </SignerRow>
                  );
                })}
              </SignersList>
            )}

            {addSigner && currentSignerList.length < 10 && (
              <AddForm>
                <Input
                  autoFocus
                  size="small"
                  placeholder="signer@example.com"
                  value={email}
                  onChange={handleEmailChange}
                  status={(!isValidEmail || isDuplicateEmail) ? "error" : undefined}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && email !== "") { handleAddSigner(); }
                    if (event.key === 'Escape') {
                      setAddSigner(false);
                      setIsDuplicateEmail(false);
                      setIsValidEmail(true);
                    }
                  }}
                />
                <FormActions>
                  <Button
                    size="small"
                    onClick={() => {
                      setAddSigner(false);
                      setIsDuplicateEmail(false);
                      setIsValidEmail(true);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="small"
                    type="primary"
                    disabled={!email}
                    onClick={handleAddSigner}
                  >
                    Add
                  </Button>
                </FormActions>
              </AddForm>
            )}

            {!isValidEmail && <ErrorMsg>Please enter a valid email address.</ErrorMsg>}
            {isDuplicateEmail && <ErrorMsg>This signer has already been added.</ErrorMsg>}
            {showMessage && <ErrorMsg>Maximum 10 signers allowed.</ErrorMsg>}

            {!addSigner && (
              <AddSignerCTA
                type="dashed"
                icon={<PlusOutlined />}
                block
                disabled={currentSignerList.length >= 10}
                onClick={() => {
                  if (currentSignerList.length === 10) {
                    setAddSigner(false);
                    setShowMessage(true);
                  } else {
                    setAddSigner(true);
                  }
                  setEmail("");
                }}
              >
                Add signer
              </AddSignerCTA>
            )}
          </SignersPanel>

        }
      </>
      <SidebarListTitle
        collapsed={collapsed}
        title="Attributes"
        tooltipDescription={"Drag and drop attribute to document."}
      />
      {currentSignerList.length === 0 ?
        <Tooltip title={"Please assign at least one signer before placing attributes."} placement="right" color={MAINBLUE}>
          <List
            style={currentSignerList.length !== 0 ? { background: "" } : { opacity: 0.3 }}
            dataSource={widgetListData}
            renderItem={({ id, type, name, icon }) => (
              <WidgetWrapper
                type={type}
                _key={"index-" + id}
                widgetListData={widgetListData}
                handleChangeActiveWidget={handleChangeActiveWidget}
              >
                <ScTooltip title={name} zIndex={collapsed ? 100 : -100}>
                  <List.Item.Meta
                    className={activeWidget.active && type === widgetType ? "active-widget" : ""}
                    avatar={icon}
                    title={collapsed ? "" : name} />
                </ScTooltip>
              </WidgetWrapper>
            )}
          />
        </Tooltip>
        :
        <List
          style={(currentSignerList.length !== 0) ? { background: "" } : { opacity: 0.3 }}
          dataSource={widgetListData}
          renderItem={({ id, type, name, icon }) => (
            <WidgetWrapper
              type={type}
              _key={"index-" + id}
              widgetListData={widgetListData}
              handleChangeActiveWidget={handleChangeActiveWidget}
            >
              <ScTooltip title={name} zIndex={collapsed ? 100 : -100}>
                <List.Item.Meta
                  className={activeWidget.active && type === widgetType ? "active-widget" : ""}
                  avatar={icon}
                  title={collapsed ? "" : name} />
              </ScTooltip>
            </WidgetWrapper>
          )}
        />
      }
    </Wrapper>
  );
};

const Wrapper = styled.div<WrapperProps>`
width: ${(p) => p.collapsed ? "none" : "230px"};
padding-left: ${(p) => p.collapsed ? "none" : "10px"};
border-top: 1px groove;
.ant-list-item-meta.active-widget {
  background-color: ${LIGHTBLUE};
  color: ${MAINBLUE};
  border-radius: ${SPACE};

  .ant-list-item-meta-title {
    color: ${MAINBLUE};
  }
}
  .ant-list-item-meta {
    margin: ${(p) => p.collapsed ? `${SPACE} ${SPACE_MD}` : `${SPACE}`} ;
    color: ${G70};
    ${(p) =>
    p.collapsed
      ? `padding: ${SPACE_XS} ${SPACE_XS}`
      : `padding: ${SPACE_XS} ${SPACE_SM}`};
  }

  .ant-list-item-meta-title {
    color: ${G70};
  }

  .ant-list-item-meta:hover {
    background-color: ${(p) => (p.signsetList.length !== 0 ? LIGHTBLUE : WHITE)};
    color: ${(p) => (p.signsetList.length !== 0 ? MAINBLUE : "")};
    //background-color: ${LIGHTBLUE};
    //color: ${MAINBLUE};
    border-radius: ${SPACE};

    .ant-list-item-meta-title {
      color: ${(p) => (p.signsetList.length !== 0 ? MAINBLUE : "")}};
      //color: ${MAINBLUE}};
    }
  }

  .anticon svg {
    font-size: 16px;
  }

  .ant-select {
    width: ${(p) => p.collapsed ? "60px" : "180px"};
    font-size: 14px;
    margin-left: 10px;
    color: ${BLACK};
  }

  .ant-select-item-option:active-widget  {
    background-color: ${LIGHTBLUE};
    color: ${MAINBLUE};
    border-radius: ${SPACE};

    .ant-select-item-option-title {
      color: ${MAINBLUE};
    }
  }
    
  .ant-select-item-option:hover  {
    background-color: ${LIGHTBLUE};
    color: ${MAINBLUE};
    border-radius: ${SPACE};

    .ant-list-item-meta-title {
      color: ${MAINBLUE};
    }
  }

 
  .ant-select-dropdown {
    min-width: ${(p) => p.collapsed ? 280 : 180}px;
  }

  .ant-radio-button-wrapper {
    width: ${(p) => (p.signsetList.length > 4 ? 195 : 205)}px;
    height: auto;
    border-style: none;
    color: ${BLACK};
    padding-bottom: 10px;
  }
  
  .ant-radio-button-wrapper-checked {
    background-color: ${LIGHTBLUE};
    color: ${BLACK};
    border-radius: ${SPACE};
  }
  
  .ant-radio-button-wrapper:hover {
    background-color: ${LIGHTBLUE};
    color: ${MAINBLUE};
    border-radius: ${SPACE};
  }
  
  .ant-radio-button-wrapper:hover .delete-button{
    display: inline-block; /* Initially hide the delete button */
  }

  .ant-radio-group{
    overflow-y: ${(p) => p.signsetList.length > 4 ? "scroll" : "hidden"};
    max-height: 250px;
  }

  .long-text-button {
    max-width: 180px;
    word-break: break-all;
  }
  
  
  .delete-button {
    position: absolute;
    top: 0;
    right: 0;
    display: none; /* Initially hide the delete button */
    border: none;
    background: transparent;
  }
`;

/* ---------- Signers panel (redesigned) ---------- */

const SignersPanel = styled.div`
  padding: 8px 4px 4px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const EmptyHint = styled.div`
  font-size: 12px;
  color: #8c8c8c;
  padding: 8px 4px;
  text-align: center;
  background: #fafafa;
  border-radius: 6px;
`;

const SignersList = styled.div<{ $scroll: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: ${(p) => (p.$scroll ? "240px" : "none")};
  overflow-y: ${(p) => (p.$scroll ? "auto" : "visible")};
  padding-right: ${(p) => (p.$scroll ? "4px" : "0")};

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: #d9d9d9; border-radius: 3px; }
`;

const SignerRow = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
  border: 1px solid transparent;
  background: ${(p) => (p.$selected ? LIGHTBLUE : "transparent")};
  border-color: ${(p) => (p.$selected ? MAINBLUE : "transparent")};

  &:hover {
    background: ${(p) => (p.$selected ? LIGHTBLUE : "#f5f7fa")};
  }

  &:hover button.signer-delete {
    opacity: 1;
  }
`;

const SignerAvatar = styled.div<{ $selected: boolean }>`
  flex: 0 0 auto;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: ${(p) => (p.$selected ? MAINBLUE : "#bfbfbf")};
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
`;

const SignerEmail = styled.div`
  flex: 1 1 auto;
  font-size: 13px;
  color: ${BLACK};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DeleteIconBtn = styled(Button).attrs({ className: "signer-delete" })`
  flex: 0 0 auto;
  opacity: 0;
  transition: opacity 0.15s ease;

  &:focus,
  &:focus-visible { opacity: 1; }
`;

const AddForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
  background: #fafafa;
  border-radius: 6px;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 6px;
`;

const ErrorMsg = styled.div`
  font-size: 12px;
  color: #ff4d4f;
  padding: 0 4px;
`;

const AddSignerCTA = styled(Button)`
  margin-top: 4px;
`;

const CollapsedSigners = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px 0;
  max-height: 320px;
  overflow-y: auto;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #d9d9d9; border-radius: 2px; }
`;

const CollapsedAvatar = styled.div<{ $selected: boolean }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${(p) => (p.$selected ? MAINBLUE : "#bfbfbf")};
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-transform: uppercase;
  border: 2px solid ${(p) => (p.$selected ? MAINBLUE : "transparent")};
  box-shadow: ${(p) => (p.$selected ? "0 0 0 2px #fff inset" : "none")};
  transition: transform 0.15s ease, background 0.15s ease;

  &:hover {
    transform: scale(1.08);
    background: ${(p) => (p.$selected ? MAINBLUE : "#8c8c8c")};
  }
`;

const CollapsedEmpty = styled.div`
  font-size: 12px;
  color: #bfbfbf;
  padding: 6px 0;
`;
