output=output
echo=off

# solc = 
ifneq ($(use_solc), true)
	HARDHAT=1
endif

all: main


ifndef HARDHAT
SRCS= $(wildcard ./contracts/*.sol) 
ifneq ($(fs), )
	SRCS = $(fs)
endif

SRCS_OBJS = $(patsubst %.sol, %_output, $(SRCS)) 

main: select clean build 

build: $(SRCS_OBJS)
define show_title
    @echo -n "--------------------------------------------------------"
	@echo -n $(1)
    @echo "--------------------------------------------------------"
endef

$(SRCS_OBJS):%_output : %.sol
	$(call show_title, $<)
	@solc  @openzeppelin=`pwd`/node_modules/@openzeppelin --optimize --overwrite --abi --bin -o $(output)/$@ $<
	@echo "output-->:"
	@ls $(output)/$@ 

select:
    ifneq ($(v), )
		@solc-select use $(v)
    endif

#v=0.8.0
install:
    ifneq ($(v), )
		@solc-select install $(v)
    endif

clean:
	@echo "clean ${output}"
	@rm -v -rf $(output)/*

else
main: clean build 

build:
	npx hardhat compile
clean:
	#npx
	npx hardhat clean

upgrade:
	npx hardhat run ./scripts/violas_proof_deploy_upgrade.js

deploy:
	npx hardhat run ./scripts/violas_proof_deploy_upgrade.js

init:init_main init_datas

init_main:
	npx hardhat run ./scripts/init_main.js

init_datas:
	npx hardhat run ./scripts/init_datas.js

show_contract:
	npx hardhat run ./scripts/show_contract.js
endif

opts="deploy upgrade"
types="main state datas"
opt_value 	= ''
type_value 	= ''
opt_file 	= ''
run_mod 	= 'close'

open: update_conf show_conf
close: update_conf show_conf

merge_js_file: save_opt_type_value
    ifeq ($(opt_value)'_'$(type_value), '''_''')
    opt_file = ./scripts/switchs/$(run_mod)_all.js
    endif

save_opt_type_value: 
    ifneq ($(opt), )
	@echo $(opts) | grep -q $(opt)
    ifneq ($?, 0)
	@echo "input opt is: " $(opts)
    else
    opt_value = $(opt)
    endif
    endif

    ifneq ($(type), )
	echo $(types) | grep -q $(type)
    ifneq ($?, 0)
	@echo "input opt is: " $(types)
    else
    type_value = $(type)
    endif
    endif

	@echo "opt = " $(opt) " type = " $(type)

	
update_conf: merge_js_file
	npx hardhat run $(opt_file)

show_conf:
	npx hardhat run ./scripts/switchs/show_confs.js


.PHONY: select build clean deploy init init_main init_datas show_conf show_contract open close
