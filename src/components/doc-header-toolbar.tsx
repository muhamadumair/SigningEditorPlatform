import styled from "styled-components";
import {
  WHITE,
  G20,
  G70,
  SPACE_XS,
  UNABLE_USER_SELECT,
  MAINBLUE,
  SPACE_MD,
} from "../styles/style.constant";
import { Space, Divider, Slider, Pagination, Button } from "antd";
import { ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons";
import { PageScaleDropdown } from "./page-scale-dropdown";
import { ThumbnailButton } from "../commons/thumbnail-button";
import { StoreDispatch } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { selectDeviceStateIsDesktop, selectDocumentDetailsTotalPageNumberByDocId } from "../pages/manual-sign-page/reducer/selectors/documents-details.selector";
import { ManualSignReducerRootState } from "../pages/manual-sign-page/reducer";
import { signsetsDetailsActions } from "../pages/manual-sign-page/reducer/slices/signsets-details.slice";
import { selectSignsetsDetailsSelectedDocumentId, selectSignsetsDetailsSelectedPageNumber } from "../pages/manual-sign-page/reducer/selectors/signsets-details.selector";
import { documentsDetailsActions } from "../pages/manual-sign-page/reducer/slices/documents-details.slice";
import { Scalable } from "../models/views/generic.model";

interface DocHeaderToolbarProps {
  showZoomDropdown?: boolean;
  showZoomSlider?: boolean;
  showThumbnailButton?: boolean;
  onClickThumbnail?: () => void;
  isDisableUndo?: boolean;
  isDisableRedo?: boolean;
  scale: number;
  setScale?: (value: number) => void;
}

interface StyledSlider extends Scalable { isDesktop: boolean; }
interface LeftSection { isDesktop: boolean; }

export const DocHeaderToolbar = ({
  showThumbnailButton = true,
  onClickThumbnail = () => { },
  setScale = () => { },
  scale,
}: DocHeaderToolbarProps) => {

  const dispatch = useDispatch<StoreDispatch>();

  const selectedDocumentId = useSelector((state: ManualSignReducerRootState) =>
    selectSignsetsDetailsSelectedDocumentId(state)
  );

  const selectedPageNumber = useSelector((state: ManualSignReducerRootState) =>
    selectSignsetsDetailsSelectedPageNumber(state)
  );


  const totalPageNumber = useSelector(
    (state: ManualSignReducerRootState) =>
      selectDocumentDetailsTotalPageNumberByDocId(state, selectedDocumentId)!
  );

  const isDesktop = useSelector((state: ManualSignReducerRootState) =>
    selectDeviceStateIsDesktop(state)
  );

  const onPageChange = (pageNumber: number) => {
    dispatch(signsetsDetailsActions.setSelectedPageNumber(pageNumber));
    dispatch(documentsDetailsActions.setIsThumbnailClicked(true));
  };


  return (
    <Wrapper>
      <LeftSection isDesktop={isDesktop}>
        <Space size={"small"} >
          <Button icon={<ZoomOutOutlined />} style={{ border: "none" }} onClick={() => setScale(scale - 0.25)} />
          <PageScaleDropdown
            scale={scale}
            setScale={(value: number) => setScale(value)}
            isDesktop={isDesktop}
          />
          <Button icon={<ZoomInOutlined />} style={{ border: "none" }} onClick={() => setScale(scale + 0.25)} />
        </Space>
        {!isDesktop &&
          <Space style={{ paddingTop: 10 }}>
            <Pagination
              simple
              defaultCurrent={1}
              current={selectedPageNumber}
              total={totalPageNumber! * 10}
              onChange={onPageChange}
              style={{ width: 170, fontSize: 10 }}
            />
          </Space>
        }
      </LeftSection>
      {isDesktop &&
        <MiddleSection>
          <Space>
            <Pagination
              simple
              defaultCurrent={1}
              current={selectedPageNumber}
              total={totalPageNumber! * 10}
              onChange={onPageChange}
            />
          </Space>
        </MiddleSection>
      }

      <RightSection style={{ display: "block" }}>
        <div style={{ marginLeft: 68 }}>
          {showThumbnailButton ? (
            <ThumbnailButton onClick={onClickThumbnail} isDesktop={isDesktop} />
          ) : (
            ""
          )}
        </div>
      </RightSection>
    </Wrapper>

  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;

  background: ${WHITE};
  border-bottom: 1px solid ${G20};
  padding: ${SPACE_XS} ${SPACE_MD};
  ${UNABLE_USER_SELECT}
`;

const LeftSection = styled.div<LeftSection>`
  display: ${(p) => p.isDesktop ? "flex" : "block"};
`;
const MiddleSection = styled.div`
  fontSize: 14px;
  padding-top: 10px;
  margin-right: 350px
`;
const RightSection = styled.div``;

const StyledDivider = styled(Divider)`
  color: ${G70};
  border-left: 1px solid rgba(0, 0, 0, 0.1);
`;

const StyledSlider = styled(Slider) <StyledSlider>`
  width: ${(p) => p.isDesktop ? 160 : 130}px;
  .ant-slider-track {
    background-color: ${MAINBLUE};
  }

  &:hover .ant-slider-track {
    background-color: #1890ff;
  }
`;
