import { Result, ResultProps } from "antd";
import styled from "styled-components";
import { WHITE } from "../styles/style.constant";

interface ResultDocPageProps extends ResultProps {
  pageWidth?: number;
  pageHeight?: number;
  isDisplay?: boolean;
  backgroundColor?: string;
  extraCssInjection?: string;
}

export const ResultDocPage = ({
  isDisplay = true,
  status,
  title,
  subTitle,
  pageWidth = 595.27,
  pageHeight = 841.89,
  extraCssInjection,
}: ResultDocPageProps) => {
  return (
    <ResultDoc
      isDisplay={isDisplay}
      pageHeight={pageHeight}
      pageWidth={pageWidth}
      extraCssInjection={extraCssInjection}
    >
      <ResultPage status={status} title={title} subTitle={subTitle} />
    </ResultDoc>
  );
};

const ResultDoc = styled.div<ResultDocPageProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  ${(p) => (p.isDisplay ? "" : "display: none;")}

  /* Fixed width & height */
  width: ${(p) => p.pageWidth}px;
  height: ${(p) => p.pageHeight}px;

  background: ${WHITE};

  margin-left: 50%;
  transform: translateX(-50%);

  ${(p) => p.extraCssInjection}
`;

const ResultPage = styled(Result)``;
