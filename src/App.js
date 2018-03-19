import React, {Component} from 'react';
import './App.css';
import sword from './img/sword.svg';
import swords from './img/swords.svg';
import tree from './img/tree.svg';

class App extends Component {

  state = {
    accountName: '',
    accountId: '',
    allBattles: '',
    avgDamage: '',
    sessionBattles: '',
    sessionDmg: '',
    nextAvgDmg: '',
    treeCut: ''
  };

  changeNickName = () => {
    fetch('https://api.worldoftanks.ru/wot/account/list/?application_id=demo&search=' + this.state.accountName)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            accountIdLoaded: true,
            accountId: result.data[0].account_id
          });
          fetch('https://api.worldoftanks.ru/wot/account/info/?application_id=demo&account_id=' + this.state.accountId)
            .then(res => res.json())
            .then(
              (result) => {
                console.log('--->', result.data[this.state.accountId].statistics);
                this.setState({
                  allBattles: result.data[this.state.accountId].statistics.all.battles,
                  avgDamage: Math.round(result.data[this.state.accountId].statistics.all.damage_dealt / result.data[this.state.accountId].statistics.all.battles),
                  treeCut: result.data[this.state.accountId].statistics.trees_cut
                })
              }
            )
        }
      )
  };

  calcDmg = () => {
    const battles = Number(this.state.allBattles) + Number(this.state.sessionBattles);
    this.setState({
      nextAvgDmg: Math.round(((this.state.allBattles * this.state.avgDamage) + (this.state.sessionBattles * this.state.sessionDmg)) / (battles))
    })
  };

  handleChange = (e) => {
    const name = e.target.attributes.name.nodeValue;
    const value = e.target.value;
    this.setState({
      [name]: value
    })
  };

  coloredDmg = (avgDamage) => {
    if (this.state[avgDamage] < 750) {
      return <span className='red'>{Math.round(this.state[avgDamage])}</span>
    } else if (this.state.avgDamage >= 750) {
      return <span className='yellow'>{Math.round(this.state[avgDamage])}</span>
    } else if (this.state.avgDamage >= 1000) {
      return <span className='green'>{Math.round(this.state[avgDamage])}</span>
    } else if (this.state.avgDamage >= 1800) {
      return <span className='blue'>{Math.round(this.state[avgDamage])}</span>
    } else if (this.state.avgDamage >= 2500) {
      return <span className='purpure'>{Math.round(this.state[avgDamage])}</span>
    }
  };


  componentWillReceiveProps(nextProps) {

  }


  render() {

    return (

      <div className="App">

        <header className="header">
          WoT<span className="yellow">Calc</span>
        </header>

        <div className="container">

          <div className='searchInputTitle'>Введите ваш игровой ник</div>

          <div className='searchInput'>
            <input type="text" placeholder='Ник' onChange={this.handleChange} name='accountName'/>
            <button onClick={this.changeNickName}>ok</button>
          </div>

          {this.state.accountId ?
            <div>
              <div className="accData">
                <div className='nickname'>{this.state.accountName}</div>
                <div className='avgDamage'><img src={sword} alt=""/>Средний урон: {this.coloredDmg('avgDamage')}</div>
                <div className='allBattles'><img src={swords} alt=""/>Количество боёв: <span>{this.state.allBattles}</span></div>
                <div className='trees'><img src={tree} alt=""/>Количество поваленных деревьев: <span>{this.state.treeCut}</span></div>
              </div>
              <div className='inputWrapper'>
                <input type="text" placeholder='количество боёв за сессию' onChange={this.handleChange} name='sessionBattles'/>
                <input type="text" placeholder='средний урон за сессию' onChange={this.handleChange} name='sessionDmg'/>
              </div>
              <button className='button' onClick={this.calcDmg}>Рассчитать</button>
            </div>
            : ''}

          {this.state.nextAvgDmg ? <div className='nextAvgDmg'>Через {this.state.sessionBattles} боёв средний урон на аккаунте будет равен <br/> {this.coloredDmg('nextAvgDmg')}</div> : ''}

          {/*<p className='subtext'>Вы можете использовать этот калькулятор для рассчёта урона на аккаунте или отдельно на технике</p>*/}

        </div>

      </div>
    );
  }
}

export default App;