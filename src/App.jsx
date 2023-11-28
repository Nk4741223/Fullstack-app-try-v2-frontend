import React, { useState, useEffect } from "react";
import axios from "axios";

import "./styles.css";
import { CardHeader } from "./components/CardHeader";
import { CardAria } from "./components/CardAria";
import { TextHeader } from "./components/TextHeader";
import { TextAria } from "./components/TextAria";

export const App = () => {
  const [cards, setCards] = useState([]);
  const [text, setText] = useState({ title: "", content: "" });
  const [activeCardId, setActiveCardId] = useState(false);
  const HEROKU_PORT =
    "https://fullstack-app-try-v2-backend-502e5d8bbc87.herokuapp.com/api/cards/";
  const LOCAL_PORT = "http://localhost:5000/api/cards/";

  //カード全体を取得ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
  const getCards = async () => {
    const response = await axios.get(HEROKU_PORT || LOCAL_PORT);
    setCards(response.data);
    setSerchInput("");
  };

  //初回の表示
  useEffect(() => {
    getCards();
  }, []);

  //検索機能ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
  const [serchInput, setSerchInput] = useState("");
  const onChangeInput = async (value) => {
    setSerchInput(value);
    //DBから検索
    const response = await axios.get(
      (HEROKU_PORT || LOCAL_PORT) + `search/query?q=${value}`
    );
    setCards(response.data);
  };

  //カードを追加ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
  const onClickAdd = async () => {
    try {
      await savePreviousCard(); //以前のカードを保存

      //DBに新規作成
      const response = await axios.post(HEROKU_PORT || LOCAL_PORT, {
        title: "",
        content: "",
      });

      setActiveCardId(response.data._id); //新規カードをアクティブ化
      updateText(); //テキスト初期化
      getCards(); //更新して表示
    } catch (err) {
      console.log(err);
    }
  };

  //テキスト更新
  const updateText = (activeCard) => {
    const newText = Object.assign({}, text);
    if (activeCard) {
      newText.title = activeCard.data.title;
      newText.content = activeCard.data.content;
    } else {
      newText.title = "";
      newText.content = "";
    }
    setText(newText);
  };

  //カードを削除ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
  const onClickDelete = async () => {
    try {
      if (!activeCardId) return;
      clearTimer();

      //DBから削除
      await axios.delete((HEROKU_PORT || LOCAL_PORT) + activeCardId);

      //次のカードをアクティブにする
      const ActiveCardIndex = cards.findIndex(
        (card) => card._id === activeCardId
      );
      if (ActiveCardIndex === cards.length - 1) {
        setActiveCardId(false); //アクティブカード初期化
        updateText(); //テキスト初期化
      } else {
        setActiveCardId(cards[ActiveCardIndex + 1]._id); //次のカードをアクティブ化

        //DBからアクティブカードを取得
        const activeCard = await axios.get(
          (HEROKU_PORT || LOCAL_PORT) + cards[ActiveCardIndex + 1]._id
        );
        updateText(activeCard); //テキスト更新
      }
      getCards(); //更新して表示
    } catch (err) {
      console.log(err);
    }
  };

  //カードを１つ取得ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
  const onClickCard = async (cardId) => {
    if (activeCardId === cardId) return;
    try {
      await savePreviousCard(); //以前のカードを保存
      setActiveCardId(cardId); //クリックしたカードをアクティブ化

      //アクティブカードを取得
      const activeCard = await axios.get((HEROKU_PORT || LOCAL_PORT) + cardId);
      updateText(activeCard); //テキスト更新
      getCards(); //更新して表示
    } catch (err) {
      console.log(err);
    }
  };

  //以前のカードを保存
  const savePreviousCard = async () => {
    if (activeCardId) {
      clearTimer();

      //１つ前のアクティブカードを取得
      const previousCard = await axios.get(
        (HEROKU_PORT || LOCAL_PORT) + activeCardId
      );
      //変更があれば、１つ前のアクティブカードをDBに保存
      if (
        previousCard.data.title !== text.title ||
        previousCard.data.content !== text.content
      ) {
        await axios.put((HEROKU_PORT || LOCAL_PORT) + activeCardId, {
          title: text.title,
          content: text.content,
        });
      }
    }
  };

  //カードの編集----------------------------------------------------------------------------------
  const [timeoutId, setTimeoutId] = useState(false);
  const [inputChange, setInputChange] = useState(false);
  const [savedFlag, setSavedFlag] = useState(false);
  const autoSaveTime = 5000;

  //テキスト変更
  const onChangeText = (value, key) => {
    if (activeCardId) {
      //カード配列を変更
      const newCards = cards.map((card) => {
        if (card._id === activeCardId) {
          const newCard = Object.assign({}, card);
          newCard[key] = value;
          return newCard;
        } else {
          return card;
        }
      });
      setCards(newCards);

      //テキストを変更
      const newText = Object.assign({}, text);
      newText[key] = value;
      setText(newText);

      setInputChange(!inputChange);
    }
  };

  //自動保存
  useEffect(() => {
    if (!activeCardId) return;
    //タイマーをセット
    const resetTimer = () => {
      clearTimer();
      const newTimeoutId = setTimeout(async () => {
        try {
          //DB保存
          await axios.put((HEROKU_PORT || LOCAL_PORT) + activeCardId, {
            title: text.title,
            content: text.content,
          });
          setSavedFlag(true);
          //更新して表示
          getCards();
        } catch (err) {
          console.log(err);
        }
      }, autoSaveTime);
      setTimeoutId(newTimeoutId);
    };
    resetTimer();
  }, [inputChange]);

  //タイマーをクリア
  const clearTimer = () => {
    clearTimeout(timeoutId);
    setSavedFlag(false);
  };

  //並び替え
  cards.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return (
    <>
      <h1>Notes</h1>
      <div id="flame-row">
        <div id="card-flame">
          <CardHeader
            // ref={ref}
            // handleSerch={handleSerch}
            serchInput={serchInput}
            onChangeInput={onChangeInput}
            onClick={onClickAdd}
          />
          <CardAria
            cards={cards}
            onClickCard={onClickCard}
            activeCardId={activeCardId}
          />
        </div>
        <div id="text-flame">
          <TextHeader savedFlag={savedFlag} onClick={onClickDelete} />
          <TextAria text={text} onChangeText={onChangeText} />
        </div>
      </div>
    </>
  );
};
