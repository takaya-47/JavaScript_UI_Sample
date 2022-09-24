'use strict';
{
  const formButton = document.getElementById("formButton");
  formButton.addEventListener("click", () => {
    fetchWeather()
      .then((json) => {
        createResult(json);
        beginObserve();
      });
  });

  const fetchWeather = async () => {
    // クエリパラメータの作成
    const params = {
      cnt: document.getElementById("cnt").value,
      lat: "36.3272526",
      lon: "138.4259718",
      units: "metric",
      lang: "ja",
      appid: "5423c830d8a0abd979f0f9e94c0572fa"
    };
    const queryParams = new URLSearchParams(params).toString();
    // URI全体の生成
    const url = "https://api.openweathermap.org/data/2.5/forecast?" + queryParams;

    // 非同期でAPIからレスポンスを受け取る
    try {
      const response = await fetch(
        url,
        { method: "GET" }
      );
      if (!response.ok) throw new Error("エラー発生");
      return response.json();
    } catch (e) {
      console.error(e);
    }
  };

  const createResult = (json) => {
    const main = document.querySelector("main");
    // すでに要素の作成がされていたら一度全て破棄する
    while (main.lastChild) {
      main.removeChild(main.lastChild);
    }

    json.list.forEach(ele => {
      // HTML要素の生成
      const result = document.createElement("div");
      const date = document.createElement("div");
      const temperature = document.createElement("div");
      const humidity = document.createElement("div");
      const weather = document.createElement("div");
      // 親子関係の設定
      result.appendChild(date);
      result.appendChild(temperature);
      result.appendChild(humidity);
      result.appendChild(weather);
      main.appendChild(result);
      // クラスの設定
      result.classList.add("result");
      date.classList.add("date");
      temperature.classList.add("temperature");
      humidity.classList.add("humidity");
      weather.classList.add("weather");
      // テキストの設定
      date.innerText = ele.dt_txt;
      temperature.innerHTML = ele.main.temp;
      humidity.innerHTML = ele.main.humidity;
      weather.innerHTML = ele.weather[0].description;
    });
  };

  const beginObserve = () => {
    const callback = (entries, observer) => {
      console.log(entries);
      entries.forEach((entry) => {
        // 要素が交差していないときは何も行わない
        if (!entry.isIntersecting) return;

        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      });
    };

    const options = {
      root: null,
      rootMargin: "0px 0px -100px 0px",
      threshold: 0.2,
    };

    // 監視オブジェクトの生成と監視の開始
    const observer = new IntersectionObserver(callback, options);
    document.querySelectorAll(".result").forEach((target) => {
      observer.observe(target);
    });
  };
}