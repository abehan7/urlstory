import React, { useState, useRef } from "react";
import styled from "styled-components";
import { ItemConatiner } from "./styled/ItemContainer";
import { useUrl } from "../../contexts/UrlContext";
import { Title } from "./styled/Title.styled";
import { TitleWrapper } from "./styled/TitleWrapper.styled";
import Indicator from "./Indicator";
import Marker from "./Marker";
import { debounce, throttle } from "lodash";
import Loader from "../Utils/Loader/Loader";
import ItemContainer from "./ItemContainer";
import SearchBar from "../SearchBar/SearchBar";
import { KeywordNormalize, SearchNotByDB } from "../Utils/Search";
import { useEffect } from "react";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIsClicked, RESET_TAGS } from "../../store/reducers/Tags";
import { useFolder } from "../../contexts/FolderContext";
import NoUrl from "./NoUrl";
import { constants, useMode } from "../../contexts/ModeContext";
import LoadingCenter from "../Utils/Loader/LoaderCenter";
import { getToken } from "../../redux/ReducersT/tokenReducer";
import GuestItemContainer from "./GuestItemContainer";

export const LeftBoxEl = styled.div`
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  max-width: 100%;

  .newItem {
    div:nth-child(4) {
      animation: big-and-small 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
    }
  }

  @keyframes big-and-small {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
`;

export const FlexContainer = styled(ItemConatiner)`
  position: relative;
  animation: ${({ folderBoxAnimeCount }) =>
    folderBoxAnimeCount === 1 ? "fadeIn 0.5s ease-in" : ""};

  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  /* gap: 1.3rem; */
  gap: 1rem;
  height: calc(100% - 130px - 1rem - 30px);
  max-height: calc(100% - 130px - 1rem - 30px);
  width: 90%;
  background-color: #f7f8fa;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;

  overflow-y: scroll;
  overflow-x: hidden;

  scrollbar-width: 0;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const SearchTitle = styled(Title)`
  width: 40px;
  cursor: pointer;
  margin-left: 1rem;
  border-radius: 10px;
  padding: 0.5rem;
  transition: all 0.3s ease-in-out;
  position: relative;
  background-color: #a597fe;
  color: #fff;
  ${({ tagIsClicked }) => tagIsClicked && `display: none;`}
  :hover {
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  }
`;

const TagTitle = styled(SearchTitle)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TitleContainerEl = styled.div`
  @keyframes jaehee {
    0% {
      transform: translate3d(-200px, 0, 0);
    }
    100% {
      transform: translate3d(0px, 0, 0);
    }
  }
  flex: 1;
  display: flex;
  height: 100%;
  align-items: center;

  > span {
    animation: jaehee 0.3s ease-in-out;
  }
`;

const debounceFn = debounce((fn, keyword) => fn(keyword), 400);

const LeftBox = () => {
  const [isScroll, setIsScroll] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const scrollRef = useRef(null);
  const totalUrls = useUrl().url.totalUrls;
  const [keyword, setKeyword] = useState("");
  // const [filterdUrls, setFilterdUrls] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const { loading } = useUrl();
  const tagIsClicked = useSelector(getIsClicked);
  const combinedTagItems = useFolder().combinedTagItems.urls;
  const dispatch = useDispatch();
  const handleSetCombinedItemLoading = useFolder().handleSetCombinedItemLoading;
  const combinedItemsloading = useFolder().loading;
  const filterdUrls = useUrl().url.filterdUrls;
  const handleSetFilterdUrls = useUrl().handleSetFilterdUrls;
  const token = useSelector(getToken);
  const mode = useMode().mode;
  const folderBoxAnimeCount = useMode().count.folderBoxAnimeCount;

  // ???????????? ??? ?????????
  // ???????????? ????????? ????????????
  // ???????????? ???????????????
  const _getFilterdUrls = useCallback(
    (keyword) => {
      const pKeyword = KeywordNormalize(keyword);
      const filterd = SearchNotByDB(pKeyword, totalUrls);
      handleSetFilterdUrls(filterd);
      setIsSearchLoading(false);
    },
    [totalUrls, handleSetFilterdUrls]
  );

  const onChange = async (e) => {
    debounceFn.cancel();
    setIsSearchLoading(true);
    const _keyword = e.target.value;
    setKeyword(_keyword);
    e.target.value.length > 0 && (await debounceFn(_getFilterdUrls, _keyword));
  };

  const throttled = useRef(
    throttle((newValue, scrollTop) => {
      setScrollTop(newValue);
      // TODO: ?????? ?????? ?????? ????????? ???????????? ??????
      // const scrollPercent = newValue / (totalUrls.length * 50);
      const diff = newValue - scrollTop; //????????? ?????? ????????? ?????????
      diff > 0 ? setIsScroll(true) : setIsScroll(false);
    }, 500)
  );

  const onScroll = useCallback(
    (e) => throttled.current(e.target.scrollTop, scrollTop),
    [scrollTop]
  );

  const handleScrollUp = useCallback(() => {
    const option = { top: 0, left: 0, behavior: "smooth" };
    scrollRef.current.scrollTo(option);
  }, []);

  const isSearch = keyword.length > 0;

  const onClickSearchTitle = () => setKeyword("");

  const onClickTagTitle = () => dispatch(RESET_TAGS());

  // ????????? setting

  useEffect(() => {
    const fn = () => {
      //????????? ?????????
      tagIsClicked && dispatch(RESET_TAGS());
      handleSetFilterdUrls([]);
    };
    fn();
  }, [keyword]);

  useEffect(() => {
    isSearch && _getFilterdUrls(keyword);
  }, [totalUrls]);

  // ?????? ???????????? ???????????? setting
  useEffect(() => {
    const fn = () => {
      handleSetFilterdUrls([]);
      handleSetCombinedItemLoading(true);
      // setKeyword("");
      setTimeout(() => {
        handleSetFilterdUrls(combinedTagItems);
        handleSetCombinedItemLoading(false);
      }, [200]);
    };
    keyword.length > 0 && tagIsClicked && setKeyword("");
    keyword.length === 0 && tagIsClicked && fn();
    !tagIsClicked && handleSetFilterdUrls([]);
  }, [tagIsClicked, combinedTagItems]);

  useEffect(() => {
    const fn = () => {
      const newCombinedTagItems = totalUrls.filter((newItem) =>
        combinedTagItems.some((item) => item._id === newItem._id)
      );
      handleSetFilterdUrls(newCombinedTagItems);
    };
    tagIsClicked && fn();
  }, [totalUrls]);

  //currentFolder ???????????? filterdItems??????

  //FIXME: DOM MAPPING
  //?????? ?????????
  const TotalUrlMap = () =>
    !tagIsClicked && !isSearch && <ItemContainer urls={totalUrls} />;

  //?????? ?????????
  const SearchUrlMap = () => isSearch && <ItemContainer urls={filterdUrls} />;

  //???????????? ??? ?????????
  const SearchLoader = () => isSearch && isSearchLoading && <LoadingCenter />;

  //???????????? ????????? ?????? ???
  const SearchNoUrl = () =>
    isSearch && !isSearchLoading && filterdUrls.length === 0 && <NoUrl />;

  //?????? ?????????
  const TagUrlMap = () => tagIsClicked && <ItemContainer urls={filterdUrls} />;

  // ?????? ????????? ?????? ???
  const TagNoUrl = () =>
    tagIsClicked &&
    !combinedItemsloading &&
    combinedTagItems.length === 0 && <NoUrl />;

  // ?????? ????????? ?????????
  const TagSearchingLoader = () =>
    tagIsClicked && combinedItemsloading && <LoadingCenter />;

  //??? ?????? ?????????
  const FirstLoader = () => token && loading.isTotalUrl && <LoadingCenter />;

  // ??????????????? ????????? ?????? ???
  const NoUrlAfterFirstLoading = () =>
    token && !loading.isTotalUrl && totalUrls.length === 0 && <NoUrl />;

  // ????????? ????????? ???
  const Guest = () =>
    !token && (
      <GuestItemContainer>????????? ??? ?????? ???????????????!</GuestItemContainer>
    );

  return (
    <LeftBoxEl>
      <TitleWrapper>
        <TitleContainer
          tagIsClicked={tagIsClicked}
          isSearch={isSearch}
          onClickSearchTitle={onClickSearchTitle}
          onClickTagTitle={onClickTagTitle}
        />
        {token && <SearchBar onChange={onChange} keyword={keyword} />}
      </TitleWrapper>
      <Indicator />
      <FlexContainer
        onScroll={onScroll}
        ref={scrollRef}
        folderBoxAnimeCount={folderBoxAnimeCount}
      >
        {/* ??? ?????? ?????? */}
        {FirstLoader()}
        {/* ??? ?????? ?????? ????????? ????????? ?????? ??? */}
        {NoUrlAfterFirstLoading()}
        {/* ??????url */}
        {TotalUrlMap()}
        {/* ?????? url */}
        {SearchUrlMap()}
        {/* url ????????? */}
        {SearchLoader()}
        {/* ????????? url?????? ??? */}
        {SearchNoUrl()}
        {/* ????????? url */}
        {TagUrlMap()}
        {/* ?????? url????????? */}
        {TagNoUrl()}
        {/* ?????? ????????? 0.2s?????? ?????? */}
        {TagSearchingLoader()}
        {/* ?????? ?????? ??? */}
        {Guest()}

        <Marker isScroll={isScroll} onClick={handleScrollUp} />
      </FlexContainer>
    </LeftBoxEl>
  );
};

export default LeftBox;

const TitleContainer = ({
  tagIsClicked,
  isSearch,
  onClickSearchTitle,
  onClickTagTitle,
}) => {
  // ?????? ?????????
  const TotalTitleFn = () =>
    !tagIsClicked && !isSearch && <Title>?????? ?????????</Title>;

  // ?????? ?????????
  const TagTitleFn = () =>
    tagIsClicked && <TagTitle onClick={onClickTagTitle}>#??????</TagTitle>;

  const SearchTitleFn = () =>
    isSearch && (
      <SearchTitle onClick={onClickSearchTitle} tagIsClicked={tagIsClicked}>
        #??????
      </SearchTitle>
    );
  return (
    <TitleContainerEl isSearch={isSearch} tagIsClicked={tagIsClicked}>
      {TotalTitleFn()}
      {TagTitleFn()}
      {SearchTitleFn()}
    </TitleContainerEl>
  );
};
