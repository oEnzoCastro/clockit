import './style.css'
import * as React from 'react';
import IOSSwitch from '../switch/Switch';
export default function SubjectsBox() {
  return (
    <section className="box">

      <select name="course" id="course">
        <option value="" key="0" defaultChecked hidden >Selecione um curso</option>
        <option value="Ciência da Computação" key="Ciência da Computação">Ciência da Computação</option>
        <option value="Engenharia da Computação" key="Engenharia da Computação">Engenharia da Computação</option>
        <option value="Ciência de Dados e Inteligência Artificial" key="Ciência de Dados e Inteligência Artificial">Ciência de Dados e Inteligência Artificial</option>
        <option value="Engenharia de Computação" key="Engenharia de Computação">Engenharia de Computação</option>
      </select>

      <article className='allSubjects'>
        <div className="semester">
          <h3>1° Semestre</h3>
          <div className="subjects">
            <div className="subject">
              <h3>AEDS I</h3>
              <IOSSwitch />
            </div>
          </div>
        </div>
      </article>

    </section>
  )
}