import { ButtonApp } from './shared/buttonApp'
import { Input } from './shared/input'
import { SvgUnlock } from './shared/svgs'

export function MasterForm() {
  function handleSubmit() {}

  return (
    <form className="flex flex-col items-center shadow-md p-5 rounded-md">
      <Input label="Master" name="master" type="password" />

      <div onClick={handleSubmit}>
        <ButtonApp>
          <SvgUnlock />
        </ButtonApp>
      </div>
    </form>
  )
}
