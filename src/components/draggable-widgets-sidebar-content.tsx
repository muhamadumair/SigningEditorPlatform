import { List, Select, Radio, Input, Button, Space, Tooltip } from "antd";
import { CloseCircleTwoTone, PlusOutlined, CheckCircleTwoTone, DeleteTwoTone } from "@ant-design/icons";
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
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StoreDispatch } from "../store";
import { ManualSignReducerRootState } from "../pages/manual-sign-page/reducer";
import { selectAllSignsetDetails, selectClickedWidget, selectSignsetsDetailsSelectedDocumentId } from "../pages/manual-sign-page/reducer/selectors/signsets-details.selector";
import { signsetsDetailsActions } from "../pages/manual-sign-page/reducer/slices/signsets-details.slice";
import { documentsDetailsActions } from "../pages/manual-sign-page/reducer/slices/documents-details.slice";
import { selectDocumentDetailsSignerEmail, selectDocumentDetailsSigners, selectDocumentDetailsSignsetList } from "../pages/manual-sign-page/reducer/selectors/documents-details.selector";
import { reactLibraryFormatter } from "../utils/manual-sign-doc.util";
import isEmail from 'email-validator';

interface SidebarContentProps extends Collapsable {
  widgetListData?: any[];
}

interface Wrapper extends ActivatedWidget {
  collapsed: boolean;
  signsetList: any;
}

export const DraggableWidgetsSidebarContent = ({
  collapsed,
  widgetListData = [],
}: SidebarContentProps) => {
  const dispatch = useDispatch<StoreDispatch>();
  const signers = useSelector((state: ManualSignReducerRootState) => selectDocumentDetailsSigners(state));
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

  const handleChangeSigner = (event: any) => {
    const email = collapsed ? event : event.target.value;
    dispatch(documentsDetailsActions.setSignerEmail(email)); // Set the index of signer
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
          <Select
            defaultValue={signsetList && signsetList.length > 0 ? signsetList[0].email : currentSignerList[0]?.value}
            style={{ width: collapsed ? 60 : 180, fontSize: 14, marginLeft: 10, color: "black" }}
            options={currentSignerList}
            onChange={handleChangeSigner}
            dropdownStyle={{ minWidth: collapsed ? 280 : 180 }}
          />
          :
          <>
            <div style={{
              width: currentSignerList.length > 4 ? 220 : 215,
              paddingLeft: 8, paddingTop: 10
            }}>
              <div style={{ border: "1px groove" }}>
                <Radio.Group
                  style={{ overflowY: currentSignerList.length > 4 ? "scroll" : "hidden", maxHeight: 250 }}
                  ref={signerListRef}
                  value={signerEmail}
                >
                  {currentSignerList.map((signer) => (
                    <Radio.Button
                      value={signer.value}
                      onChange={handleChangeSigner}
                      key={signer.value}
                    >
                      <div className="long-text-button">{signer.label}</div>
                      <Button
                        icon={<DeleteTwoTone twoToneColor="red" />}
                        style={{ border: "none", background: "transparent" }}
                        className="delete-button"
                        onClick={() => {
                          const updatedSignerList = currentSignerList.filter((userEmail) => userEmail.value !== signer.value);
                          const changeSignsetListFormat = signsetList.filter((signsetItem: any) => signsetItem?.email !== signer.value);
                          const updatedSignsetList = allSignsetDetails.filter((signsetItem) => signsetItem?.signerEmail !== signer.value);

                          setCurrentSignerList(updatedSignerList);
                          dispatch(documentsDetailsActions.setSignsetList(changeSignsetListFormat));
                          dispatch(signsetsDetailsActions.setInitialSignsetsDetails(updatedSignsetList));
                        }}
                      />
                    </Radio.Button>
                  ))}
                </Radio.Group>
                {addSigner && currentSignerList.length < 10 &&
                  <Space.Compact style={{ width: '100%' }}>
                    <Input
                      placeholder="Email"
                      value={email}
                      onChange={handleEmailChange}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' && email !== "") { handleAddSigner(); }
                        if (event.key === 'Delete') {
                          setAddSigner(false);
                          setIsDuplicateEmail(false);
                          setIsValidEmail(true);
                        }
                      }}
                    />
                    <Button
                      icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
                      style={{ border: "1px groove" }}
                      onClick={handleAddSigner}
                    />
                    <Button
                      icon={<CloseCircleTwoTone
                        twoToneColor="#eb2f96" />}
                      style={{ border: "1px groove", cursor: currentSignerList.length !== 0 ? "pointer" : "default" }}
                      disabled={currentSignerList.length === 0 ? true : false}
                      onClick={() => {
                        setAddSigner(false);
                        setIsDuplicateEmail(false);
                        setIsValidEmail(true);
                      }} />
                  </Space.Compact>

                }
              </div>
              {isDuplicateEmail && <div style={{ color: "red", paddingTop: 5, textAlign: "start" }}>Please enter a unique email</div>}
              {!isValidEmail && <div style={{ color: "red", paddingTop: 5, textAlign: "start" }}>Please enter a valid email address</div>}
              {showMessage && <div style={{ color: "red", paddingTop: 5, textAlign: "start" }}>Maximum 10 signers accepted</div>}
              <div style={{ paddingTop: 5, textAlign: "end" }}>
                <Button
                  icon={<PlusOutlined />}
                  style={{ border: "none" }}
                  onClick={() => {
                    if (currentSignerList.length === 10) {
                      setAddSigner(false);
                      setShowMessage(true);
                    }
                    else {
                      setAddSigner(true);
                    }
                    setEmail("");
                  }} />
              </div>
            </div>

          </>

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

const Wrapper = styled.div<Wrapper>`
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
