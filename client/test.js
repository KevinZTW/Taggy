<div id="readability-page-1" class="page"><article>          <p>上次我們介紹了三種 Rect Component Patterns，包含 <code>Compound component</code>、<code>Render props component</code> 與 <code>Prop collections &amp; getters</code>，而今天要繼續往下介紹剩下的五個 Patterns:</p><ul><li>State Initializers</li><li>State Reducer</li><li>Control Props</li><li>Provider</li><li>Higher-order component</li></ul><p>若對前三個 Pattern 不熟悉，或是沒看過上一篇文章的可以移駕至 <a href="https://blog.arvinh.info/2018/06/27/advanced-react-component-patterns-note/">進階 React Component Patterns 筆記（上）</a></p><p>接下來的 Pattern 都會延續之前的 Demo 範例，所以建議先閱讀過上篇！</p><p>此外，每個 Pattern 的最後都放有 codesandbox 的 demo link，覺得文字太多的可以直接去看完整的 code 喔！</p><p>有時候我們會希望能讓元件回復到初始狀態，或是能讓使用者自己定義初始狀態，這時就適合採用 State initializer 技巧。</p><p>首先，我們利用自定義的 <code>initialState</code> 來存放元件初始狀態，而在真正的 state 中去 reference 它：</p><pre><code>class Toggle extends React.Component {  static defaultProps = { onToggle: () =&gt; { } };  initialState = { on: false };  state = this.initialState;  // ...other function}</code></pre><p>這樣一來，要實作 <code>reset</code> 函式就相當簡單了：</p><pre><code>reset = () =&gt;  this.setState(this.initialState, () =&gt;    this.props.onReset(this.initialState)  );</code></pre><p>而要讓使用者能自定義元件初始狀態的方式，相信多數讀者都有用過，也就是讓使用者透過 props 來定義元件的 initial state：</p><pre><code>class Toggle extends React.Component {  static defaultProps = { onToggle: () =&gt; { }, initialOn: false };  initialState = { on: this.props.initialOn };  state = this.initialState;  // ...other function}</code></pre><p>由於並不是所有使用者都會自行定義初始狀態，所以別忘了在 <code>defaultProps</code> 中宣告我們自己希望的初始值喔！</p><p><a href="https://codesandbox.io/embed/2wp3jr6o8j">Demo link</a></p><p>上面的 Demo 範例是延續<a href="https://blog.arvinh.info/2018/06/27/advanced-react-component-patterns-note/">上篇</a>提到的 <code>Prop collections &amp; getters</code> 與 <code>Render props</code>，所以這邊加入的 <code>reset</code> 按鈕要記得加入 <code>getStateAndHelpers</code> 中傳遞給 <code>render props</code> 中的 children 使用。</p><p>State Reducer 是一個蠻有趣的概念，主要目的是讓使用者能夠介入元件狀態改變的行為，讓元件在每次的 <code>setState</code> 時，都能夠被使用者影響。</p><p>舉個簡單的範例，像是我們先前的 Toggle component，如果今天使用者提出個需求，想要讓這個元件只能被 toggle 三次，那我們該怎麼做呢？</p><p>你當然可以讓使用者多傳一個 props 控制次數，然後在內部更動狀態時去檢查有沒有超過那個次數：</p><pre><code>class Toggle extends React.Component {  static defaultProps = {    onToggle: () =&gt; {},    onReset: () =&gt; {},    initialOn: false  };  // 元件內部多一個 toggleTimes 來控制目前的 toggle 次數  initialState = { on: this.props.initialOn, currentToggleTimes: 0 };  state = this.initialState;  reset = () =&gt;    this.setState(this.initialState, () =&gt;      this.props.onReset(this.initialState)    );  toggle = () =&gt; {    // 每次 toggle 時判斷有沒有超過使用者定義的 toggle 次數上限    if (this.state.currentToggleTimes &gt;= this.props.toggleTimes) {      console.log('toggle too much')      return;    }    this.setState(      ({ on }) =&gt; ({        on: !on,        currentToggleTimes:this.state.currentToggleTimes + 1 }),      () =&gt; this.props.onToggle(this.state.on),    );  }  // ...other methods}</code></pre><p>但你也知道使用者的需求總是會變動，假如他突然間也想控制 reset 的次數怎麼辦? 你的程式不就改不完？</p><p>這時我們就能採用 <code>State Reducer</code>，先看一下使用者應該會怎麼使用 <code>State Reducer</code>：<br>｀</p><pre><code>class App extends React.Component {  initialState = { timesClicked: 0 }  state = this.initialState  toggleStateReducer = (state, changes) =&gt; {    // state 為 Toggle 的 current state    // changes 為該次 Toggle 動作所造成的改變    if (this.state.timesClicked &gt;= 4) {      return { ...changes, on: false }    }    return changes  }  render() {    return (      &lt;div className="App"&gt;        &lt;Toggle          initialOn={true}          onToggle={on =&gt; {            this.setState(({ timesClicked }) =&gt; ({               timesClicked: timesClicked + 1,             }))          }}          onReset={initialState =&gt; this.setState(this.initialState)}          stateReducer={this.toggleStateReducer}        &gt;          {({ on, getTogglerProps, reset }) =&gt; (            // render props          )}        &lt;/Toggle&gt;      &lt;/div&gt;    );  }}</code></pre><p>我們讓使用者傳入一個 <code>stateReducer</code>，其中接受兩個參數，一個是 Toggle component 的 current state，另一個是該次 Toggle component 執行 <code>setState</code> 時，所接受的變化 <code>changes</code>，而回傳值就是 Toggle component 實際 <code>setState</code> 時所接受的 change object。</p><p>因此在這個函式中，使用者就擁有了一個機會能夠在元件真正觸發 <code>setState</code> 之前，進行一些操作，以剛剛例子來說，就能在這邊判斷使用者自己紀錄的 state(<code>timesClicked</code>) 有沒有超過某個值，如果超過了，那我們之後每次的回傳結果中，都會將 <code>on</code> 這個 state 設為 false。</p><p>那元件本身該如何讓 <code>stateReducer</code> 介入 <code>setState</code> 中呢？重點就在這段：</p><pre><code>internalSetState(changes, callback) {    this.setState(currentState =&gt; {      // 確認傳入的 changes 是單純的物件，或是函式      const changesObject =        typeof changes === 'function' ? changes(currentState) : changes      // 呼叫使用者傳入的 stateReducer 來取得最終的 state change object      const reducedChanges =        this.props.stateReducer(currentState, changesObject) || {}      // 最後只是檢查一下 changes 是否為空，避免重複 render      return Object.keys(reducedChanges).length        ? reducedChanges        : null    }, callback)  }</code></pre><p>我們需要建立一個介面與原本 <code>setState</code> 相同的 <code>internalSetState</code> 的方法，取代原本的 <code>setState</code>。</p><p>其中需要注意的有兩點，一個是原本的 <code>setState</code> 是能接受函式當第一個參數的，因此我們需要先判斷 <code>changes</code> 是否為 function，才能繼續進行其他動作。</p><p>另一個則是並非所有的 <code>setState</code> 都一定要用 <code>internalSetState</code> 取代，像是 <code>reset</code> function 我們可能不太希望使用者能介入，應該要很明確的 reset 所有狀態，因此這邊可以用原本的 <code>setState</code>。</p><p>看看 <a href="https://codesandbox.io/embed/wyl152o1jw">Demo Link</a> ，並實際玩玩看會更清楚！</p><p>另外，在 Kent C. Dodds 的 workshop 中，他在 internalSetState 的實作上有提到一種他比較偏好的寫法：</p><pre><code>internalSetState(changes, callback) {    this.setState(currentState =&gt; {      return [changes]        .map(c =&gt; typeof c === 'function' ? changes(currentState) : c)        .map(c =&gt; this.props.stateReducer(currentState, c) || {})        .map(c =&gt; Object.keys(reducedChanges).length ? c : null)[0]  }</code></pre><p>透過硬轉成 array 後，再用 map 將每個步驟 chain 起來，的確比較乾淨跟簡單，但比起原本做法沒那麼直覺就是了，尤其是最後還要取 <code>[0]</code> 出來，但參考一下也不錯！</p><p>透過 <code>State Reducer</code>，不僅使用者開心（能夠介入元件 state 的更動），開發者也不用疲於奔命一直改 code（讓使用者自己處理 reducer 實際內容），但壞處就是你需要呼叫一個 <code>internalSetState</code> 的函式，蠻可能造成 trace code 上的困擾，算是個 trade-off。</p><p>除非你從來沒有用 React 開發與表單相關的 component，否則你一定用過 <code>Control Props</code>，因為所謂的 <code>Control Props</code> 其實就是 <code>Controlled component</code> 的一種實作。</p><p>舉例來說，<code>Select</code>, <code>Input</code> 等 <code>Form</code> 的元件，當使用者輸入值時，其改變的是元件的內部狀態，該狀態通常綁定在 <code>value</code> 這個屬性上頭。</p><p>若在 React 中想要取得使用者輸入進表單元件的值時，你就會想要將 state 綁定在元件的 <code>value</code> 上頭，然而，一但你傳值給 <code>value</code>（也就是 <code>value={this.state.value}</code>），你就必須要自己利用 handler 去控制它的狀態改變，否則使用者再怎麼輸入，都不會改變其狀態。因為在你傳值給 <code>value</code> 的時候，這個元件就已經歸你控制了，這樣的方式可以保證該元件內部狀態是 single source of truth，不會有使用者的輸入與你的 state 不一致的狀態發生。（關於 <code>Controlled component</code> 在 React 官方網站有詳細的<a href="https://reactjs.org/docs/forms.html">介紹</a>）</p><p>所以說，<code>Control Props</code> 就是想利用這樣的技巧，讓你的元件在讓使用者自行操作 input 時，能確保元件內部狀態的 single source of truth。透過這種方式，也就能夠從使用者角度來同步多個元件的內部狀態。</p><p>一樣已先前的 Toggle 元件來舉例，但這次我們用個簡化版：</p><p>假設今天使用者想同步兩個元件的狀態，他們可以透過本身的 <code>State</code> 來控制，並在 <code>onToggle</code> 時來更動 <code>State</code>：</p><pre><code>class App extends React.Component {  state = { bothOn: false };  handleToggle = on =&gt; {    this.setState({ bothOn: on });  };  render() {    return (      &lt;div className="App"&gt;        &lt;Toggle on={this.state.bothOn} onToggle={this.handleToggle}&gt;           {({ on, toggle }) =&gt; (            &lt;div&gt;              {on ? "The button is on" : "The button is off"}              &lt;hr /&gt;              &lt;button className="button1" onClick={toggle}&gt;                {on ? "click on" : "click off"}              &lt;/button&gt;              &lt;hr /&gt;            &lt;/div&gt;          )}        &lt;/Toggle&gt;        &lt;Toggle on={this.state.bothOn} onToggle={this.handleToggle}&gt;          {({ on, toggle }) =&gt; (            // same render props as above          )}        &lt;/Toggle&gt;      &lt;/div&gt;    );  }}</code></pre><p>但要記得，<code>onToggle</code> 實際上是 <code>Toggle</code> 元件內部執行完 <code>toggle</code> 後才會執行的動作（告知使用者該元件"被" Toggle 了），這樣的話，元件要怎麼依照傳入的 Props 來處理內部狀態呢？</p><p>來看一下我們 Toggle 的實作：</p><pre><code>class Toggle extends React.Component {  state = { on: false };  isControlled(prop) {    return this.props[prop] !== undefined;  }  getState() {    return Object.entries(this.state).reduce((combinedState, [key, value]) =&gt; {      if (this.isControlled(key)) {        combinedState[key] = this.props[key];      } else {        combinedState[key] = value;      }      return combinedState;    }, {});  }  toggle = () =&gt; {    if (this.isControlled("on")) {      this.props.onToggle(!this.getState().on);    } else {      this.setState(        ({ on }) =&gt; ({ on: !on }),        () =&gt; {          this.props.onToggle(this.getState().on);        }      );    }  };  render() {    return this.props.children({ ...this.getState(), toggle: this.toggle });  }}</code></pre><p>主要重點在於，每次 <code>toggle</code> 被 trigger 時，我們都會先去確認一下 <code>on</code> 這個 state 有沒有被使用者 <code>Controlled</code>（<code>isControlled()</code>），若是使用者有透過 <code>props</code>（使用者端）傳值給這個 <code>state</code>（元件內部），就代表我們得將該 <code>state</code> 的掌控交給使用者。</p><p>什麼叫『交給使用者』呢？</p><p>其實也就是要將使用者傳入的 props 與我們自己本身的 state 做 <strong>combination</strong>，並將結果當作元件實際的 state 來使用，如同上述程式碼中的 <code>getState()</code> 函數。之後元件所有需要操作 state 的地方都需要透過該函數來取得元件的 <strong>Current State</strong>。</p><p>如此一來，只要使用者有傳入 <code>on</code> 這個 props，元件內部關於 <code>on</code> 這個 state 的變化，就會像是由使用者本身操控一般（因為我們在每次取得 current state 時都會 merge props 中對應的值），也就能讓使用者同步多個 <code>Toggle</code> component 了！</p><p><code>Control Props</code> 用文字敘述比較繁瑣難懂，可以到下面的 demo link 玩玩，試著把 <code>Toggle</code> component 的 <code>on</code> props 拿掉看看差別，拿掉 props 後，兩個元件的狀態就無法同步，但元件本身的狀態還是正常的。<br><a href="https://codesandbox.io/embed/p94nmr2p2m">demo link</a></p><p>在 Kent C. Dodds 的 workshop 中，他其實還有介紹如何整合先前的 <code>State Reducer</code> 與 <code>Control Props</code>，不過我覺得過於複雜，除了很難光用文字敘述外，實際使用的機會感覺也不大，如果有興趣的讀者可以直接去 <a href="https://codesandbox.io/s/github/kentcdodds/advanced-react-patterns-v2">codesandbox</a> 上看範例(file 10.js)</p><p>Provider pattern 其實是為瞭解決 <code>Props drilling</code> 的問題，什麼是 <code>Props drilling</code> 呢？</p><p>舉個簡單例子：</p><pre><code>class Toggle extends React.Component {  state = { on: false };  toggle = () =&gt; { /*...*/ };  render() {    return this.props.children({ ...this.state, toggle: this.toggle });  }}const Layer1 = ({toggle, ...props}) =&gt; &lt;Layer2 toggle={toggle} /&gt;const Layer2 = ({toggle, ...props}) =&gt; &lt;Layer3 toggle={toggle} /&gt;const Layer3 = ({toggle, ...props}) =&gt; &lt;button onClick={toggle} /&gt;class App extends React.Component {  handleToggle = () =&gt; {};  render() {    return (      &lt;Toggle onToggle={this.handleToggle}&gt;        &lt;Layer1 /&gt;      &lt;/Toggle&gt;    );  }}</code></pre><p>我知道這段 code 很奇怪，但這裡想呈現的重點是，有些時候我們可能真的想要把某個外層的 props 往下傳遞給底下的 component，這種情況下可能得一層一層將 props 往下帶，即便中間經過的 component 都不需要用到該 props。</p><p>要解決這樣的問題，可以利用 React 的 <a href="https://medium.com/dailyjs/reacts-%EF%B8%8F-new-context-api-70c9fe01596b"><code>Context API</code></a>。</p><p>雖然在 React 16 以前，<code>Context API</code> 在官方文件是一直處於一種不推薦使用的狀態，但大概因為太多人需要吧（像是 <code>redux</code> 等 state management 其實都有用到），現在有了新的實作，讓我們終於可以放心使用 <code>Context API</code> 了，因此這邊要介紹的 <code>Provider pattern</code>，其實就是利用 React 最新的 <code>Context API</code> 來解決 <code>Props drilling</code> 問題！</p><p>早在<a href="https://blog.arvinh.info/2018/06/27/advanced-react-component-patterns-note/">上篇</a>中介紹的 <code>Compound component</code> 我們就有用到 Provider pattern 了，而現在就讓我們用剛剛那個離奇的例子來做點修正吧：</p><pre><code>const ToggleContext = React.createContext();class Toggle extends React.Component {  static Consumer = ToggleContext.Consumer;  toggle = () =&gt; this.setState(({ on }) =&gt; ({ on: !on }));  state = { on: false, toggle: this.toggle };  render() {    const { children, ...rest } = this.props;    const ui = typeof children === "function" ? children(this.state) : children;    return (      &lt;ToggleContext.Provider value={this.state} {...rest}&gt;        {ui}      &lt;/ToggleContext.Provider&gt;    );  }}</code></pre><p>利用 React 16 後出現的 <code>React.createContext()</code>，創造一個 <code>ToggleContext</code>，並將其提供的 <code>Consumer</code> 當作 static 變數放在 <code>Toggle</code> 中。</p><p>接著在 render function 中我們使用 <code>Context API</code> 提供的另一個 component <code>Provider</code>，將傳入 <code>Toggle</code> 的 render props 包裹住，並且將 <code>Toggle</code> 本身的 <code>state</code> 或 <code>function</code> 傳到 <code>value</code> 這個 props 中。如此一來，<code>Toggle</code> 底下的所有 children 之後只要將自己用 <code>Toggle.Consumer</code> 包住就可以自由存取 <code>Toggle</code> 傳下來的 <code>value</code>：</p><pre><code>const Layer1 = () =&gt; &lt;Layer2 /&gt;;const Layer2 = () =&gt; &lt;Layer3 /&gt;;const Layer3 = () =&gt; (  &lt;Toggle.Consumer&gt;    {({ on, toggle }) =&gt; (      &lt;Fragment&gt;        &lt;div&gt;{on ? "The button is on" : "The button is off"}&lt;/div&gt;        &lt;button className="button1" onClick={toggle}&gt;          {on ? "click on" : "click off"}        &lt;/button&gt;      &lt;/Fragment&gt;    )}  &lt;/Toggle.Consumer&gt;);class App extends React.Component {  render() {    return (      &lt;div className="App"&gt;        &lt;Toggle&gt;          &lt;Layer1 /&gt;        &lt;/Toggle&gt;      &lt;/div&gt;    );  }}</code></pre><p>由上面的程式碼可以看到，<code>Toggle</code> component 的 <code>state</code> 與 <code>toggle</code> function 都會被當成 props 傳給被 <code>Toggle.Consumer</code> 包裹著的 children。</p><p>包在第三層的 <code>&lt;Layer3 /&gt;</code> 就可以直接拿到想要的 <code>on</code> 與 <code>toggle</code>，再也不用從 <code>Layer1</code> 傳到 <code>Layer2</code> 再傳到 <code>Layer3</code> 了！</p><p><a href="https://codesandbox.io/embed/m3p2p38z5j">Demo Link</a></p><p>最後一個 Pattern 我想是大家最熟悉，也是我認為最需要懂得融會貫通的 <code>Higher-order component</code>，通常簡稱 <code>HOC</code>。旨在解決 <a href="https://en.wikipedia.org/wiki/Cross-cutting_concern">Cross-Cutting Concerns</a>，說白一點就是讓你將一些可共用的邏輯抽取出來，讓其他元件透過 <code>HOC</code> 的包裝後，能獲得該共用功能，之後修改新增時不會因為邏輯跟元件綁太緊而出現問題。</p><p>雖然很重要，但這個 Pattern 相對簡單，React 官網其實就有<a href="https://reactjs.org/docs/higher-order-components.html">非常詳細的介紹</a>。這邊就簡單介紹就好，先來個範例吧：</p><pre><code>const Layer1 = () =&gt; &lt;Layer2 /&gt;;const Layer2 = () =&gt; &lt;Layer3 /&gt;;const Layer3 = withToggle(({contextProps: { on, toggle }}) =&gt; (  &lt;Fragment&gt;    &lt;div&gt;{on ? "The button is on" : "The button is off"}&lt;/div&gt;    &lt;button className="button1" onClick={toggle}&gt;      {on ? "click on" : "click off"}    &lt;/button&gt;  &lt;/Fragment&gt;));const Layer4 = withToggle(({contextProps: { on, toggle }}) =&gt; (  &lt;Fragment&gt;    &lt;div&gt;      &lt;button className="button2" onClick={toggle}&gt;        {on ? "click on" : "click off"}      &lt;/button&gt;    &lt;/div&gt;    &lt;div&gt;{on ? "The button2 is on" : "The button2 is off"}&lt;/div&gt;  &lt;/Fragment&gt;));class App extends React.Component {  render() {    return (      &lt;div className="App"&gt;        &lt;Toggle&gt;          &lt;Layer1 /&gt;          &lt;Layer4 /&gt;        &lt;/Toggle&gt;      &lt;/div&gt;    );  }}</code></pre><p>這個範例延續前一個 <code>Provider pattern</code>，我們將 <code>Toggle.Consumer</code> 抽出來，包裝成一個 <code>HOC</code> <code>withToggle</code>，這樣一來，我們可以輕鬆製造出多個擁有 <code>Toggle</code> component 功能與狀態的元件，像是這邊的 <code>Layer3</code> 與 <code>Layer4</code>，他們只需要 care 自己的 UI 邏輯即可，剩下與 <code>Toggle</code> 相關的狀態操作都交由 <code>withToggle</code> 這個 HOC 幫忙處理。</p><p>而 <code>withToggle</code> 長這樣：</p><pre><code>function withToggle(Component) {  function Wrapper(props, ref) {    return (      &lt;Toggle.Consumer&gt;        {toggleContext =&gt; (          &lt;Component contextProps={toggleContext} {...props} ref={ref} /&gt;        )}      &lt;/Toggle.Consumer&gt;    );  }  Wrapper.displayName = `withToggle(${Component.displayName ||    Component.name})`;  return hoistNonReactStatics(React.forwardRef(Wrapper), Component);}</code></pre><p>是不是很簡單呢！</p><p><code>HOC</code> 負責主要的共用邏輯，在這邊就是 <code>Toggle.Consumer</code> 這段，然後將傳入的 <code>Component</code> 塞入，可能是放在 <code>render</code> 或是像這邊是傳入 <code>Consumer</code> 的 children。</p><p>特別要注意的有三點，一個是 <code>displayName</code>，由於 <code>HOC</code> 會回傳一個新的 Component，這時如果你沒有明確定義一個 <code>displayName</code> 的話，在 Dev tool 裡你就只能看到一個 <code>Unknown</code> 的元件，會造成開發上的困擾，所以記得要指定一下 <code>displayName</code>，通常會用 <code>HOC</code> 自己的名稱加上原有 Component 的 <code>displayName</code>。</p><p>另一個要注意的點是 <code>forwardRef</code>，在 React 中，<code>ref</code> 與 <code>props</code> 的處理方式不相同，<code>ref</code> 並不會如同 props 一般往下傳遞，若你想要取得被 <code>HOC</code> 包裹過的 component 的 <code>ref</code>，那在你的 <code>HOC</code> 中，必須使用 <code>React.forwardRef</code> 將其 forward 下去，詳細介紹可以看<a href="https://reactjs.org/docs/forwarding-refs.html">官網說明</a>。</p><p>最後，假如你原先的 component 有一些 <code>static method</code>，透過 <code>HOC</code> 包裝後，你可能會發現那些 <code>static method</code> 都取不到了！</p><p>你必須要在 <code>HOC</code> 中自行複製一份到 <code>HOC</code> 上頭，像這樣（取自 <a href="https://reactjs.org/docs/higher-order-components.html#static-methods-must-be-copied-over">React 官網</a>)：</p><pre><code>function enhance(WrappedComponent) {  class Enhance extends React.Component {/*...*/}  // Must know exactly which method(s) to copy :(  Enhance.staticMethod = WrappedComponent.staticMethod;  return Enhance;}</code></pre><p>但這樣太麻煩了，我們可以直接利用 <code>hoistNonReactStatics</code> 這套 lib 來幫忙，這樣就萬無一失了！</p><pre><code>import hoistNonReactStatic from 'hoist-non-react-statics';function enhance(WrappedComponent) {  class Enhance extends React.Component {/*...*/}  hoistNonReactStatic(Enhance, WrappedComponent);  return Enhance;}</code></pre><p><a href="https://codesandbox.io/embed/q3wmv6okqw">Demo Link</a></p><p>介紹了這麼多種 Pattern，其實我覺得 HOC、Render Props 與 Compound Component 是最需要好好掌握並且多加運用的，其他如 State Reducer、Prop Collections and Getters 則是平常在進行 Code Review 時，可以好好拿出來思考一下是否能夠採用，為你的專案加分。<br>無論如何，經過這樣的學習與紀錄，至少讓自己平日開發時，能主動多思考一些優化的方向與可能性，總體是蠻有收穫的！</p><p>最後提供大家 Kent C. Dodds 在 workshop 後自己寫的一篇文章，<a href="https://blog.kentcdodds.com/mixing-component-patterns-4328f1e26bb5">Mixing Component Patterns</a>，裡頭他將這些 pattern 結合在一起使用，有興趣的讀者可以去看看到底這麼多 Pattern 要怎麼融合使用。</p><p>謝謝真的有看到這邊的各位，這些筆記斷斷續續的紀錄，一不小心就篇幅很多...若發現中間有敘述不順或是錯誤的地方，歡迎大家告知！</p><h2>資料來源</h2><ol><li><a href="https://frontendmasters.com/courses/advanced-react-patterns/">Advanced React Patterns workshop</a></li><li><a href="https://codesandbox.io/s/github/kentcdodds/advanced-react-patterns-v2">Advanced React Patterns V2 codesandbox</a></li><li><a href="https://blog.kentcdodds.com/advanced-react-component-patterns-56af2b74bc5f">Advanced React Patterns Blog</a></li><li><a href="https://blog.kentcdodds.com/answers-to-common-questions-about-render-props-a9f84bb12d5d">Answers to common questions about render props</a></li><li><a href="https://hackernoon.com/do-more-with-less-using-render-props-de5bcdfbe74c">Do more with less using render props</a></li><li><a href="https://medium.com/dailyjs/reacts-%EF%B8%8F-new-context-api-70c9fe01596b">React new context api</a></li><li><a href="https://blog.kentcdodds.com/mixing-component-patterns-4328f1e26bb5">Mixing Component Patterns</a></li></ol><p>關於作者：<br><a href="http://blog.arvinh.info/about/">@arvinh</a> 前端攻城獅，熱愛數據分析和資訊視覺化</p>        </article></div>