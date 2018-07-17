<template>
   <main class="container">
    <modal v-model="openImport" ref="modal">
      <div slot="title">
        <h4 class="modal-title">Importar Archivo</h4>
      </div>
      <div>
        <div class="form-group">
          <label for="archivo" class="control-label">Archivo:</label>
          <input type="file" class="form-control" ref="file" accept=".csv" id="archivo" @change="handleFileUpload" required="required">
        </div>
      </div>
      <div slot="footer">
        <btn type="button" class="btn btn-default" @click="closeImport">Close</btn>
        <btn type="button" class="btn btn-primary" :disabled="file === '' ? true : false" @click="submitFile">Save</btn>
      </div>
    </modal>
    <modal v-model="openAdd">
      <div slot="title">
        <h4 class="modal-title">Agregar Gasto</h4>
      </div>
      <div>
        <form id="addForm">
          <div class="form-group">
            <label for="fecha" class="control-label">Fecha:</label>
            <input type="datetime-local" v-model="newDate" class="form-control" id="fecha" required="required">
          </div>
          <div class="form-group">
            <label for="concepto" class="control-label">Concepto:</label>
            <input type="text" v-model="newConcept" class="form-control" id="concepto" required="required">
          </div>
          <div class="form-group">
            <label for="" class="control-label">Cantidad:</label>
            <input type="number" v-model="newQuantity" class="form-control" id="cantidad" required="required">
          </div>
        </form>
      </div>
      <div slot="footer">
        <btn type="button" class="btn btn-default" @click="closeAdd">Close</btn>
        <btn type="button" class="btn btn-primary" @click="createResource" :disabled="newDate !=='' && newConcept !== '' && newQuantity >0 ? false: true">Save</btn>
      </div>
    </modal>
    <modal v-model="openDelete">
      <div slot="title">
        <h4 class="modal-title" id="myModalLabel">Warning!</h4>
      </div>
      <div>
        <p>Are you Sure to Eliminate following Record?</p>
        <form id="deleteForm">
          <div class="form-group">
            <label for="fecha" class="control-label">Fecha:</label>
            <input type="text" :value="recordToEliminate.fecha" class="form-control" readonly>
          </div>
          <div class="form-group">
            <label for="concepto" class="control-label">Concepto:</label>
            <input type="text" :value="recordToEliminate.concepto" class="form-control" readonly>
          </div>
          <div class="form-group">
            <label for="" class="control-label">Cantidad:</label>
            <input type="text" :value="recordToEliminate.cantidad" class="form-control" readonly>
          </div>
        </form>
      </div>
      <div slot="footer">
        <btn type="button" class="btn btn-default" @click="closeDelete">Close</btn>
        <btn type="button" class="btn btn-primary" @click="deleteResource">OK</btn>
      </div>
    </modal>
    <section class="table-wrapper">
      <header class="table-title">
        <div class="row">
          <div class="col-md-4">
            <h2>Gastos</h2>
          </div>
          <div class="col-md-8">
            <form action="" id="searchOps" class="form-inline text-right">
              <div class="form-group">
                <select class="form-control" v-model="selectedOption" @change="changeSelect(selectedOption)">
                  <option value="0" selected="">Seleccionar opción</option>
                  <option value="1">Fecha</option>
                  <option value="2">Concepto</option>
                  <option value="3">Cantidad</option>
                </select>
              </div>
              <div class="form-group">
                <input type="text" v-model="searchValue" class="form-control">
              </div>
              <btn type="submit" class="btn btn-primary" @click="search">
                <span class="glyphicon glyphicon-search"></span>
              </btn>
              <btn type="submit" class="btn btn-default" @click="reload">
                <span class="glyphicon glyphicon-refresh"></span>
              </btn>
              <btn class="btn btn-default" @click="openImport=true">
                  <span class="glyphicon glyphicon-open-file"></span>
                  <span>Importar</span>
              </btn>
              <btn class="btn btn-success" @click="openAdd=true">
                <span class="glyphicon glyphicon-plus-sign"></span>
                <span>Agregar</span>
              </btn>
            </form>
          </div>
        </div>
      </header>
      <div class="table-responsive">
        <table class="table table-striped" id="tabla-gastos">
          <thead>
            <tr>
              <th scope="col">Fecha<span class="glyphicon glyphicon-sort btn-sm" @click="sortByDate"></span></th>
              <th scope="col-">Concepto<span class="glyphicon glyphicon-sort btn-sm" @click="sortByConcept"></span></th>
              <th scope="col">Cantidad<span class="glyphicon glyphicon-sort btn-sm" @click="sortByQuantity"></span></th>
              <th scope="col">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(gasto, index) in records" :key="gasto.id">
              <td>{{gasto.fecha}}</td>
              <td>{{gasto.concepto}}</td>
              <td>{{gasto.cantidad}}</td>
              <td>
                <btn class="delete btn-lg" @click="toEliminate(gasto, index)">
                  <span class="glyphicon glyphicon-trash"></span>
                </btn>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: 'gastos',
  data () {
    return {
      openImport: false,
      openAdd: false,
      openDelete: false,
      file: '',
      newDate: '',
      newConcept: '',
      newQuantity: 0,
      records: [],
      recordToEliminate: '',
      indexToEliminate: -1,
      searchValue: '',
      selectedOption: 0,
      searchCriteria: '',
      dateSortDir: 'asc',
      conceptSortDir: 'asc',
      quantitySortDir: 'asc'
    }
  },
  methods: {
    toEliminate (r, i) {
      this.indexToEliminate = i
      this.recordToEliminate = r
      this.openDelete = true
    },
    closeImport () {
      const input = this.$refs.file
      input.type = 'text'
      input.type = 'file'
      this.file = ''
      this.openImport = false
    },
    closeAdd () {
      this.newDate = ''
      this.newConcept = ''
      this.newQuantity = 0
      this.openAdd = false
    },
    closeDelete () {
      this.recordToEliminate = ''
      this.indexToEliminate = -1
      this.openDelete = false
    },
    submitFile () {
      if (this.file !== '') {
        let formData = new FormData()
        formData.append('document', this.file)
        this.doRequest('upload', formData)
          .then(() => {
            this.closeImport()
          }, (_) => {
            console.log('error')
          })
      }
    },
    handleFileUpload () {
      this.file = this.$refs.file.files[0]
    },
    doRequest (action, params) {
      if (this.$store.getters.isAuthenticated()) {
        return this.$store.dispatch(action, params)
      }

      this.$router.push('/login')

      return Promise.reject(new Error('Token Expired'))
    },
    createResource () {
      let data = {'fecha': this.newDate, 'concepto': this.newConcept, 'cantidad': this.newQuantity}
      this.doRequest('create', data)
        .then(() => {
          this.closeAdd()
          this.listResources()
        }, (_) => {
          console.log('Token Expired')
        })
    },
    listResources () {
      this.doRequest('list', {})
        .then((resp) => {
          this.records = resp.data
        }, (_) => {
          console.log('error')
        })
    },
    deleteResource () {
      this.doRequest('delete', this.recordToEliminate.id)
        .then(() => {
          this.$delete(this.records, this.indexToEliminate)
          this.closeDelete()
        }, (_) => {
          console.log('error')
        })
    },
    reload () {
      this.searchValue = ''
      this.listResources()
    },
    changeSelect (s) {
      this.searchCriteria = s
    },
    search () {
      let params = {}
      if (this.isFirstOptSelected) {
        this.$notify({type: 'warning', title: 'Select Option', content: 'please select an option', duration: 0})
        return
      }

      if (this.isSecondOptSelected) {
        const isValid = this.isValidDate
        if (!isValid) {
          this.$notify({type: 'warning', title: 'Wrong Date Format', content: 'YYYY-MM-DD HH:MM expected', duration: 0})
          return
        }
        params['fecha'] = this.searchValue
      }

      if (this.isThirdOptSelected) {
        params['concepto'] = this.searchValue
      }

      if (this.isFourthOptSelected) {
        const isValid = this.isValidQuantity
        if (!isValid) {
          this.$notify({type: 'warning', title: 'Wrong Quantity Format', content: 'Examples: 1254.00,12.54,..', duration: 0})
          return
        }
        params['cantidad'] = this.searchValue
      }

      this.doRequest('list', params)
        .then((resp) => {
          this.records = resp.data
        }, (_) => {
          console.log('Error')
        })
    },
    sortByDate () {
      let sortDir = ''
      if (this.dateSortDir === 'asc') {
        this.dateSortDir = 'desc'
      } else {
        this.dateSortDir = 'asc'
      }
      sortDir = this.dateSortDir

      let arr = this.records.slice()
      arr.sort(function (a, b) {
        return sortDir === 'asc' ? Date.parse(a.fecha) - Date.parse(b.fecha) : Date.parse(b.fecha) - Date.parse(a.fecha)
      })

      this.records = arr
    },
    sortByConcept () {
      let sortDir = ''
      if (this.conceptSortDir === 'asc') {
        this.conceptSortDir = 'desc'
      } else {
        this.conceptSortDir = 'asc'
      }
      sortDir = this.conceptSortDir

      let arr = this.records.slice()
      arr.sort(function (a, b) {
        let firstVal = a.concepto.toLowerCase()
        let secondVal = b.concepto.toLowerCase()

        if (sortDir === 'desc') {
          if (firstVal < secondVal) return 1
          if (firstVal > secondVal) return -1
          return 0
        }

        if (firstVal < secondVal) return -1
        if (firstVal > secondVal) return 1
        return 0
      })
      this.records = arr
    },
    sortByQuantity () {
      let sortDir = ''
      if (this.quantitySortDir === 'asc') {
        this.quantitySortDir = 'desc'
      } else {
        this.quantitySortDir = 'asc'
      }
      sortDir = this.quantitySortDir

      let arr = this.records.slice()
      arr.sort(function (a, b) {
        let firstVal = parseFloat(a.cantidad)
        let secondVal = parseFloat(b.cantidad)

        return sortDir === 'asc' ? firstVal - secondVal : secondVal - firstVal
      })
      this.records = arr
    }

  },
  computed: {
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    },
    isValidDate () {
      const regexDt = /^\d\d\d\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01]) (00|[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9])$/gm

      return regexDt.test(this.searchValue)
    },
    isValidQuantity () {
      const regexQ = /^\d{1,13}\.\d{1,2}$/gm

      return regexQ.test(this.searchValue)
    },
    isFirstOptSelected () {
      return this.searchCriteria === '' || this.searchCriteria === '0'
    },
    isSecondOptSelected () {
      return this.searchCriteria === '1'
    },
    isThirdOptSelected () {
      return this.searchCriteria === '2'
    },
    isFourthOptSelected () {
      return this.searchCriteria === '3'
    }
  },
  mounted () {
    this.listResources()
  }
}
</script>

<style lang="css">
.table-wrapper{
    background: #fff;
    padding: 20px 25px;
    margin: 30px 0;
    border-radius: 3px;
    box-shadow: 0 1px 1px rgba(0,0,0,.05);
}
.table-title{
    padding-bottom: 15px;
    background: #435d7d;
    color: #fff;
    padding: 16px 30px;
    margin: -20px -25px 10px;
    border-radius: 3px 3px 0 0;
}
.delete {
    color:#F44336;
}
.edit{
    color: #FFC107;
}
.edit:hover{
    text-decoration: none;
}
.dropdown-menu{
    min-width: 400px;
    margin-top: -1px;
    padding: 6px 20px;
}
h2{
    margin-top: 1px;
    margin-bottom: 3px;
}
.table-wrapper{
    padding: 0;
}
.container{
    margin-top: 15rem;
}
#searchOps {
    margin-bottom: 15px;
    padding: 30px;
    background: none;
    box-shadow: none;
}
#addForm {
    margin-bottom: 15px;
    padding: 30px;
    background: none;
    box-shadow: none;
}
#deleteForm {
    margin-bottom: 15px;
    padding: 30px;
    background: none;
    box-shadow: none;
}
</style>
