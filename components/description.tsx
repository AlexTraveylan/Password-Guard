import { useState } from 'react'
import { ButtonApp } from './shared/buttonApp'

export function Description() {
  const [isDescrHidden, setIsDescrHidden] = useState(true)

  function toggleDescr() {
    setIsDescrHidden(!isDescrHidden)
  }

  const description_1: string =
    'Password-guard est une application coffre fort pour créer, et stocker vos mots de passe et y avoir acces partout de maniere sécurisée.'
  const description_2: string =
    "Inutile de créer un compte, connectez-vous avec votre compte google, seulement les informations indispensables sont utilisées par l'application : votre email, et votre nom. Aucune donnée est stockée. Cela vous permet d'acceder à vos mots de passe de votre ordinateur, de votre téléphone ou de votre tablette."
  const description_3: string =
    'Avec Password-guard, vous pouvez generer aléatoirement des mots de passe pour en avoir un différent sur chaque site ou application.'
  const description_4: string =
    "De votre côté, vous aurez besoin de retenir seulement un seul mot de passe. Stocké de la maniere la plus sécurisé qui existe, choississez le suffisamment compliqué pour qu'il ne puisse pas être trouvé. Sinon tout vos autres mots de passe seront accessibles."
  const description_5: string =
    'Votre mot de passe maitre est crypté par un algorithme de hashage, les autres sont cryptés et encrypté par une librairie de crypto.'
  const descriptions: string[] = [
    description_1,
    description_2,
    description_3,
    description_4,
    description_5,
  ]
  return (
    <div className="mx-3 flex flex-col items-center md:w-[60%] p-3">
      {isDescrHidden ? (
        <div className="" onClick={() => toggleDescr()}>
          <ButtonApp>Voir description</ButtonApp>
        </div>
      ) : (
        <>
          <div className="" onClick={() => toggleDescr()}>
            <ButtonApp>
              <svg
                className="flex items-center justify-center"
                width="35px"
                height="35px"
                viewBox="0 0 24 24"
                strokeWidth="1.3"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                color="#000000"
              >
                <path
                  d="M4.5 8H15s0 0 0 0 5 0 5 4.706C20 18 15 18 15 18H6.286"
                  stroke="#000000"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M7.5 11.5L4 8l3.5-3.5"
                  stroke="#000000"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </ButtonApp>
          </div>
          <div className="flex flex-col items-begin justify-center text-center">
            {descriptions.map((desc) => (
              <p className="my-3" key={desc}>
                {desc}
              </p>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
